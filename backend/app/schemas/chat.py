from pydantic import BaseModel
from typing import Optional, List, Any
import uuid
from datetime import datetime


class ChatSessionCreate(BaseModel):
    dataset_id: uuid.UUID
    title: Optional[str] = "New Chat"


class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    role: str
    content: str
    sql_query: Optional[str]
    query_result: Optional[Any]
    execution_time_ms: Optional[float]
    is_error: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionResponse(BaseModel):
    id: uuid.UUID
    title: str
    dataset_id: uuid.UUID
    created_at: datetime
    messages: List[ChatMessageResponse] = []

    model_config = {"from_attributes": True}


class AskRequest(BaseModel):
    session_id: uuid.UUID
    question: str


class AskResponse(BaseModel):
    session_id: uuid.UUID
    question: str
    answer: str
    sql_query: Optional[str]
    query_result: Optional[Any]
    execution_time_ms: Optional[float]
    chart_suggestion: Optional[str] = None