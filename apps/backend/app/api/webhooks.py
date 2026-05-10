from fastapi import APIRouter
from fastapi import Request

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"]
)


@router.post("/stripe")
async def stripe_webhook(
    request: Request
):
    payload = await request.body()

    # In production, verify the signature here
    # signature = request.headers.get("stripe-signature")

    return {
        "status": "received"
    }
