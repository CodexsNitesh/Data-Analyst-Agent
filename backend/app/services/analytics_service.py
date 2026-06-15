import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from fastapi import HTTPException
from app.repositories.dataset_repo import DatasetRepository
from app.db.session import sync_engine
from app.agents.insight_agent import generate_insights
import json
import asyncio


class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = DatasetRepository(db)

    async def get_summary(self, dataset_id: uuid.UUID, user_id: uuid.UUID):
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        schema = ds.schema_info or []
        col_names = [c["name"] for c in schema]

        kpis = []
        revenue_trend = []
        top_products = []

        try:
            with sync_engine.connect() as conn:
                # Revenue KPI
                revenue_cols = [c for c in col_names if any(x in c.lower() for x in ["revenue", "amount", "total", "sales", "price"])]
                if revenue_cols:
                    rc = revenue_cols[0]
                    r = conn.execute(text(f'SELECT SUM("{rc}") FROM "{ds.table_name}"'))
                    val = r.scalar()
                    kpis.append({"label": f"Total {rc.title()}", "value": round(float(val), 2) if val else 0, "trend": "up"})

                # Row count = orders
                kpis.append({"label": "Total Records", "value": ds.row_count, "trend": "neutral"})

                # Numeric averages
                numeric_cols = [c for c in schema if "int" in c["type"].lower() or "float" in c["type"].lower() or "numeric" in c["type"].lower() or "double" in c["type"].lower()]
                for nc in numeric_cols[:2]:
                    r = conn.execute(text(f'SELECT AVG("{nc["name"]}") FROM "{ds.table_name}"'))
                    val = r.scalar()
                    if val:
                        kpis.append({"label": f"Avg {nc['name'].title()}", "value": round(float(val), 2), "trend": "neutral"})

                # Revenue trend by date or text grouping
                date_cols = [c for c in col_names if any(x in c.lower() for x in ["date", "month", "year", "period", "week"])]
                if date_cols and revenue_cols:
                    dc = date_cols[0]
                    rc = revenue_cols[0]
                    r = conn.execute(text(
                        f'SELECT "{dc}", SUM("{rc}") as total FROM "{ds.table_name}" '
                        f'GROUP BY "{dc}" ORDER BY "{dc}" LIMIT 12'
                    ))
                    revenue_trend = [{"label": str(row[0]), "value": round(float(row[1]) if row[1] else 0, 2)} for row in r.fetchall()]

                # Top products
                product_cols = [c for c in col_names if any(x in c.lower() for x in ["product", "item", "name", "category", "sku"])]
                if product_cols and revenue_cols:
                    pc = product_cols[0]
                    rc = revenue_cols[0]
                    r = conn.execute(text(
                        f'SELECT "{pc}", SUM("{rc}") as total FROM "{ds.table_name}" '
                        f'GROUP BY "{pc}" ORDER BY total DESC LIMIT 5'
                    ))
                    top_products = [{"label": str(row[0]), "value": round(float(row[1]) if row[1] else 0, 2)} for row in r.fetchall()]

        except Exception as e:
            pass

        return {
            "kpis": kpis,
            "revenue_trend": revenue_trend,
            "top_products": top_products,
            "schema": schema,
        }

    async def get_insights(self, dataset_id: uuid.UUID, user_id: uuid.UUID):
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        try:
            with sync_engine.connect() as conn:
                r = conn.execute(text(f'SELECT * FROM "{ds.table_name}" LIMIT 20'))
                columns = list(r.keys())
                rows = [dict(zip(columns, row)) for row in r.fetchall()]
                sample = [{k: str(v) for k, v in row.items()} for row in rows]
        except Exception:
            sample = []

        insights = await asyncio.get_event_loop().run_in_executor(
            None, lambda: generate_insights(ds.schema_info or [], sample)
        )
        return {"insights": insights}

    async def get_forecast(self, dataset_id: uuid.UUID, user_id: uuid.UUID, periods: int = 6):
        ds = await self.repo.get_by_id(dataset_id, user_id)
        if not ds:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        schema = ds.schema_info or []
        col_names = [c["name"] for c in schema]
        revenue_cols = [c for c in col_names if any(x in c.lower() for x in ["revenue", "amount", "total", "sales"])]
        date_cols = [c for c in col_names if any(x in c.lower() for x in ["date", "month", "year", "period"])]

        if not revenue_cols or not date_cols:
            return {"forecast": [], "message": "Dataset needs date and revenue columns for forecasting."}

        try:
            with sync_engine.connect() as conn:
                rc = revenue_cols[0]
                dc = date_cols[0]
                r = conn.execute(text(
                    f'SELECT "{dc}", SUM("{rc}") as total FROM "{ds.table_name}" '
                    f'GROUP BY "{dc}" ORDER BY "{dc}" DESC LIMIT 12'
                ))
                rows = [{"period": str(row[0]), "value": float(row[1]) if row[1] else 0} for row in r.fetchall()]
                rows.reverse()
        except Exception:
            return {"forecast": [], "message": "Could not compute forecast."}

        if len(rows) < 2:
            return {"forecast": [], "message": "Not enough historical data for forecasting."}

        # Simple linear trend forecast
        values = [r["value"] for r in rows]
        n = len(values)
        avg_growth = (values[-1] - values[0]) / n if n > 1 else 0
        last_val = values[-1]
        last_label = rows[-1]["period"]

        forecast = []
        for i in range(1, periods + 1):
            forecast.append({
                "period": f"Forecast +{i}",
                "value": round(max(0, last_val + avg_growth * i), 2),
                "is_forecast": True,
            })

        return {"historical": rows, "forecast": forecast}