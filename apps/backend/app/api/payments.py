from fastapi import APIRouter

from app.services.stripe_service import (
    StripeService
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/create-checkout")
def create_checkout():
    session = (
        StripeService
        .create_checkout_session(
            price_id="price_xxx",
            success_url=
                "http://localhost:3000/success",
            cancel_url=
                "http://localhost:3000/cancel",
        )
    )

    return {
        "checkout_url": session.url
    }
