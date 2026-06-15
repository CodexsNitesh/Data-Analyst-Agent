import os
import uuid
import json
import pandas as pd
from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, inspect
from app.repositories.dataset_repo import DatasetRepository
from app.schemas.dataset import DatasetResponse
from app.db.session import sync_engine
from app.core.config import settings
from app.core.logging import get_logger
from slugify import slugify

logger = get_logger(__name__)

PLAN_LIMITS = {
    "free": {"datasets": 3, "rows": 10000},
    "pro": {"datasets": 50, "rows": 1000000},
}


class DatasetService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = DatasetRepository(db)

    async def upload_dataset(self, file: UploadFile, user_id: uuid.UUID, user_plan: str, name: str = None, description: str = None) -> DatasetResponse:
        limit = PLAN_LIMITS.get(user_plan, PLAN_LIMITS["free"])
        current_count = await self.repo.count_by_user(user_id)

        if current_count >= limit["datasets"]:
            raise HTTPException(status_code=403, detail=f"Dataset limit reached for your plan ({limit['datasets']} datasets).")

        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")

        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        safe_name = name or os.path.splitext(file.filename)[0]
        table_name = f"ds_{slugify(safe_name, separator='_')}_{uuid.uuid4().hex[:6]}"

        save_path = os.path.join(settings.UPLOAD_DIR, f"{table_name}.csv")
        content = await file.read()

        if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            raise HTTPException(status_code=413, detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB.")

        with open(save_path, "wb") as f:
            f.write(content)

        try:
            df = pd.read_csv(save_path)
            df.columns = [c.strip().lower().replace(" ", "_").replace("-", "_") for c in df.columns]
        except Exception as e:
            os.remove(save_path)
            raise HTTPException(status_code=400, detail=f"Could not parse CSV: {str(e)}")

        if len(df) > limit["rows"]:
            os.remove(save_path)
            raise HTTPException(status_code=403, detail=f"Row limit exceeded for your plan ({limit['rows']} rows).")

        # Write to PostgreSQL using sync engine (pandas doesn't support async)
        try:
            with sync_engine.connect() as conn:
                df.to_sql(table_name, conn, if_exists="replace", index=False)
                conn.commit()
        except Exception as e:
            os.remove(save_path)
            raise HTTPException(status_code=500, detail=f"Failed to load data into database: {str(e)}")

        # Build schema info
        schema_info = []
        for col in df.columns:
            sample = df[col].dropna().head(3).tolist()
            schema_info.append({
                "name": col,
                "type": str(df[col].dtype),
                "nullable": bool(df[col].isna().any()),
                "sample_values": [str(v) for v in sample],
            })

        dataset = await self.repo.create(
            user_id=user_id,
            name=safe_name,
            original_filename=file.filename,
            table_name=table_name,
            row_count=len(df),
            column_count=len(df.columns),
            file_size_bytes=len(content),
            schema_info=schema_info,
            description=description,
        )

        logger.info(f"Dataset '{table_name}' uploaded by user {user_id}")
        return DatasetResponse.model_validate(dataset)

    async def list_datasets(self, user_id: uuid.UUID):
        datasets = await self.repo.get_all_by_user(user_id)
        return [DatasetResponse.model_validate(d) for d in datasets]

    async def get_dataset(self, dataset_id: uuid.UUID, user_id: uuid.UUID) -> DatasetResponse:
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")
        return DatasetResponse.model_validate(ds)

    async def delete_dataset(self, dataset_id: uuid.UUID, user_id: uuid.UUID):
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        # Drop the PostgreSQL table
        try:
            with sync_engine.connect() as conn:
                conn.execute(text(f'DROP TABLE IF EXISTS "{ds.table_name}"'))
                conn.commit()
        except Exception as e:
            logger.warning(f"Could not drop table {ds.table_name}: {e}")

        await self.repo.delete(ds)
        logger.info(f"Dataset {dataset_id} deleted by user {user_id}")
        return {"success": True}

    async def preview_dataset(self, dataset_id: uuid.UUID, user_id: uuid.UUID, limit: int = 20):
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        try:
            with sync_engine.connect() as conn:
                result = conn.execute(text(f'SELECT * FROM "{ds.table_name}" LIMIT :limit'), {"limit": limit})
                columns = list(result.keys())
                rows = [dict(zip(columns, row)) for row in result.fetchall()]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Preview failed: {str(e)}")

        return {"columns": columns, "rows": rows, "total": ds.row_count}