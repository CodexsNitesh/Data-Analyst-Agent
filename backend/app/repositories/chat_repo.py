from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, List
import uuid
from app.models.chat import ChatSession, ChatMessage


class ChatRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_session(self, user_id: uuid.UUID, dataset_id: uuid.UUID, title: str = "New Chat") -> ChatSession:
        session = ChatSession(user_id=user_id, dataset_id=dataset_id, title=title)
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        return session

    async def get_session(self, session_id: uuid.UUID, user_id: uuid.UUID) -> Optional[ChatSession]:
        result = await self.db.execute(
            select(ChatSession)
            .options(selectinload(ChatSession.messages))
            .where(ChatSession.id == session_id, ChatSession.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_sessions_by_user(self, user_id: uuid.UUID) -> List[ChatSession]:
        result = await self.db.execute(
            select(ChatSession).where(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc())
        )
        return result.scalars().all()

    async def add_message(self, session_id: uuid.UUID, role: str, content: str, **kwargs) -> ChatMessage:
        msg = ChatMessage(session_id=session_id, role=role, content=content, **kwargs)
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def update_session_title(self, session: ChatSession, title: str) -> ChatSession:
        session.title = title
        await self.db.commit()
        await self.db.refresh(session)
        return session