from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_user
)

from app.database.database import get_db

from app.models.user import User

from app.services.quiz_engine import (
    QuizEngineService
)

router = APIRouter(
    prefix="/quiz-attempts",
    tags=["Quiz Attempts"]
)


@router.post("/submit")
def submit_quiz(
    payload: dict,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):
    service = QuizEngineService(db)

    return service.submit_quiz(
        user_id=current_user.id,
        quiz_id=payload["quiz_id"],
        answers=payload["answers"]
    )
