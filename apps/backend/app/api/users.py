from fastapi import APIRouter
from fastapi import Depends

from app.core.dependencies import get_current_user

from app.models.user import User

from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.database import get_db

@router.get(
    "/me",
    response_model=UserResponse
)
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user

@router.get(
    "/leaderboard",
    response_model=list[UserResponse]
)
def get_leaderboard(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(
        desc(User.xp_points)
    ).limit(limit).all()
