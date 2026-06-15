from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.chat import ChatSessionCreate, ChatSessionResponse, AskRequest, AskResponse
from app.services.agent_service import AgentService
from app.repositories.chat_repo import ChatRepository

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/sessions", response_model=ChatSessionResponse, status_code=201)
async def create_session(
    payload: ChatSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ChatRepository(db)
    session = await repo.create_session(current_user.id, payload.dataset_id, payload.title)
    # session.messages = []
    # return ChatSessionResponse.model_validate(session)
    return ChatSessionResponse(
    id=session.id,
    title=session.title,
    dataset_id=session.dataset_id,
    created_at=session.created_at,
    messages=[]
)


@router.get("/sessions", response_model=list[ChatSessionResponse])
async def list_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ChatRepository(db)
    sessions = await repo.get_sessions_by_user(current_user.id)
    # result = []
    # for s in sessions:
    #     s.messages = []
    #     result.append(ChatSessionResponse.model_validate(s))
    # return result
    # return [ChatSessionResponse.model_validate(s) for s in sessions]
    return [
    ChatSessionResponse(
        id=s.id,
        title=s.title,
        dataset_id=s.dataset_id,
        created_at=s.created_at,
        messages=[]
    )
    for s in sessions
]


@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ChatRepository(db)
    session = await repo.get_session(session_id, current_user.id)
    if not session:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Session not found.")
    return ChatSessionResponse.model_validate(session)


@router.post("/ask", response_model=AskResponse)
async def ask(
    payload: AskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AgentService(db)
    return await service.ask(payload, current_user)


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = ChatRepository(db)
    session = await repo.get_session(session_id, current_user.id)
    if not session:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Session not found.")
    await db.delete(session)
    await db.commit()
    return {"success": True}