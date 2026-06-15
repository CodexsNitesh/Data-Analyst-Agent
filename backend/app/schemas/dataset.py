from pydantic import BaseModel
from typing import Optional, List, Any
import uuid
from datetime import datetime


class ColumnInfo(BaseModel):
    name: str
    type: str
    nullable: bool = True
    sample_values: List[Any] = []


class DatasetCreate(BaseModel):
    name: str
    description: Optional[str] = None


class DatasetResponse(BaseModel):
    id: uuid.UUID
    name: str
    original_filename: str
    table_name: str
    row_count: int
    column_count: int
    file_size_bytes: int
    schema_info: Optional[Any]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DatasetListResponse(BaseModel):
    datasets: List[DatasetResponse]
    total: int