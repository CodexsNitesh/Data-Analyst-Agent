import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Dataset(Base, TimestampMixin):
    __tablename__ = "datasets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    table_name = Column(String(255), nullable=False, unique=True)
    row_count = Column(Integer, default=0)
    column_count = Column(Integer, default=0)
    file_size_bytes = Column(BigInteger, default=0)
    schema_info = Column(JSON, nullable=True)
    description = Column(Text, nullable=True)

    owner = relationship("User", back_populates="datasets")
    chat_sessions = relationship("ChatSession", back_populates="dataset", cascade="all, delete-orphan")