from fastapi import APIRouter
from pydantic import BaseModel
from app.services.matchmaking_service import matchmaking_service

router = APIRouter(
    prefix="/matchmaking",
    tags=["Matchmaking"]
)

class MatchRequest(BaseModel):
    user_id: str
    username: str
    quiz_id: str

@router.post("/join")
def join_matchmaking(request: MatchRequest):
    room_id = matchmaking_service.find_match(
        request.user_id,
        request.username,
        request.quiz_id
    )

    return {
        "room_id": room_id,
        "status": "WAITING" if not room_id else "MATCHED"
    }
