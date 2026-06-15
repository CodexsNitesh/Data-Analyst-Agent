import uuid
import stripe
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, Request
from app.core.config import settings
from app.models.billing import Subscription
from app.models.user import User
from app.core.logging import get_logger

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = get_logger(__name__)


class BillingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_checkout_session(self, user: User) -> dict:
        if not settings.STRIPE_PRO_PRICE_ID:
            raise HTTPException(status_code=503, detail="Billing not configured.")
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                customer_email=user.email,
                line_items=[{"price": settings.STRIPE_PRO_PRICE_ID, "quantity": 1}],
                success_url="http://localhost:5173/billing/success",
                cancel_url="http://localhost:5173/billing/cancel",
                metadata={"user_id": str(user.id)},
            )
            return {"checkout_url": session.url}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def handle_webhook(self, request: Request) -> dict:
        payload = await request.body()
        sig = request.headers.get("stripe-signature", "")
        try:
            event = stripe.Webhook.construct_event(payload, sig, settings.STRIPE_WEBHOOK_SECRET)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        if event["type"] == "checkout.session.completed":
            data = event["data"]["object"]
            user_id = data.get("metadata", {}).get("user_id")
            if user_id:
                result = await self.db.execute(select(Subscription).where(Subscription.user_id == uuid.UUID(user_id)))
                sub = result.scalar_one_or_none()
                if sub:
                    sub.plan = "pro"
                    sub.stripe_subscription_id = data.get("subscription")
                    sub.stripe_customer_id = data.get("customer")
                    await self.db.commit()

                result2 = await self.db.execute(select(User).where(User.id == uuid.UUID(user_id)))
                user = result2.scalar_one_or_none()
                if user:
                    user.plan = "pro"
                    await self.db.commit()

        return {"received": True}

    async def get_subscription(self, user_id: uuid.UUID) -> dict:
        result = await self.db.execute(select(Subscription).where(Subscription.user_id == user_id))
        sub = result.scalar_one_or_none()
        if not sub:
            return {"plan": "free", "status": "active"}
        return {
            "plan": sub.plan,
            "status": sub.status,
            "cancel_at_period_end": sub.cancel_at_period_end,
            "queries_used": sub.queries_used_this_month,
        }