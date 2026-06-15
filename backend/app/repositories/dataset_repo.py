from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
import uuid
from app.models.dataset import Dataset


class DatasetRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, dataset_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Dataset]:
        result = await self.db.execute(
            select(Dataset).where(Dataset.id == dataset_id, Dataset.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_all_by_user(self, user_id: uuid.UUID) -> List[Dataset]:
        result = await self.db.execute(
            select(Dataset).where(Dataset.user_id == user_id).order_by(Dataset.created_at.desc())
        )
        return result.scalars().all()

    async def create(self, **kwargs) -> Dataset:
        dataset = Dataset(**kwargs)
        self.db.add(dataset)
        await self.db.commit()
        await self.db.refresh(dataset)
        return dataset

    async def delete(self, dataset: Dataset) -> None:
        await self.db.delete(dataset)
        await self.db.commit()

    async def count_by_user(self, user_id: uuid.UUID) -> int:
        result = await self.db.execute(
            select(func.count()).where(Dataset.user_id == user_id)
        )
        return result.scalar_one()