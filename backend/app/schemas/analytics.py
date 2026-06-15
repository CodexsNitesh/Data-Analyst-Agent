from pydantic import BaseModel
from typing import List, Optional, Any, Dict


class KPICard(BaseModel):
    label: str
    value: Any
    change_pct: Optional[float] = None
    trend: Optional[str] = None  # up | down | neutral


class ChartDataPoint(BaseModel):
    label: str
    value: float


class AnalyticsSummary(BaseModel):
    kpis: List[KPICard]
    revenue_trend: List[ChartDataPoint]
    top_products: List[ChartDataPoint]
    insights: List[str]