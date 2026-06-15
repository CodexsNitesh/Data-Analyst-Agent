from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.user_repo import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserPublic
from app.models.billing import Subscription
from app.core.logging import get_logger

logger = get_logger(__name__)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)

    async def register(self, payload: RegisterRequest) -> TokenResponse:
        existing = await self.repo.get_by_email(payload.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered.")

        user = await self.repo.create(
            email=payload.email,
            full_name=payload.full_name,
            hashed_password=hash_password(payload.password),
        )

        # Create free subscription record
        sub = Subscription(user_id=user.id)
        self.db.add(sub)
        await self.db.commit()

        token = create_access_token(str(user.id))
        logger.info(f"New user registered: {user.email}")
        return TokenResponse(access_token=token, user=UserPublic.model_validate(user))

    async def login(self, payload: LoginRequest) -> TokenResponse:
        user = await self.repo.get_by_email(payload.email)
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
        if not user.is_active:
            raise HTTPException(status_code=403, detail="Account is deactivated.")

        token = create_access_token(str(user.id))
        logger.info(f"User logged in: {user.email}")
        return TokenResponse(access_token=token, user=UserPublic.model_validate(user))