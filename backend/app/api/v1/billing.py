from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.billing_service import BillingService

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("/plans")
async def get_plans():
    return {
        "plans": [
            {
                "id": "free",
                "name": "Free",
                "price": 0,
                "features": ["3 datasets", "10,000 rows/dataset", "50 AI queries/month", "Basic analytics"],
            },
            {
                "id": "pro",
                "name": "Pro",
                "price": 29,
                "features": ["50 datasets", "1M rows/dataset", "Unlimited AI queries", "Advanced analytics", "Forecasting", "AI Insights"],
            },
        ]
    }


@router.post("/create-checkout")
async def create_checkout(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BillingService(db)
    return await service.create_checkout_session(current_user)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    service = BillingService(db)
    return await service.handle_webhook(request)


@router.get("/subscription")
async def get_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = BillingService(db)
    return await service.get_subscription(current_user.id)