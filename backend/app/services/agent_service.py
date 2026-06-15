import time
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.repositories.chat_repo import ChatRepository
from app.repositories.dataset_repo import DatasetRepository
from app.agents.sql_agent import run_sql_agent
from app.schemas.chat import AskRequest, AskResponse
from app.models.user import User
from app.core.logging import get_logger
import asyncio

logger = get_logger(__name__)

QUERY_LIMITS = {"free": 50, "pro": 9999}


class AgentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.chat_repo = ChatRepository(db)
        self.dataset_repo = DatasetRepository(db)

    async def ask(self, payload: AskRequest, user: User) -> AskResponse:
        session = await self.chat_repo.get_session(payload.session_id, user.id)
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found.")

        dataset = await self.dataset_repo.get_by_id(session.dataset_id, user.id)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found.")

        # Save user message
        await self.chat_repo.add_message(session.id, "user", payload.question)

        # Build chat history
        chat_history = []
        for msg in session.messages[-10:]:
            chat_history.append({"role": msg.role, "content": msg.content})

        # Run agent in thread pool (sync agent)
        start = time.time()
        try:
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: run_sql_agent(dataset.table_name, payload.question, chat_history)
            )
        except Exception as e:
            logger.error(f"Agent error: {e}")
            raise HTTPException(status_code=500, detail="AI agent encountered an error.")

        elapsed = round((time.time() - start) * 1000, 2)

        answer = result["answer"]
        sql = result.get("sql", "")
        table_data = result.get("table_data", [])

        # Save assistant message
        await self.chat_repo.add_message(
            session.id, "assistant", answer,
            sql_query=sql,
            query_result=table_data if table_data else None,
            execution_time_ms=elapsed,
        )

        # Auto-update session title from first question
        if len(session.messages) <= 1:
            title = payload.question[:60]
            await self.chat_repo.update_session_title(session, title)

        return AskResponse(
            session_id=session.id,
            question=payload.question,
            answer=answer,
            sql_query=sql,
            query_result=table_data,
            execution_time_ms=elapsed,
        )