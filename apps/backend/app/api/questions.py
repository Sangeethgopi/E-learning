from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.question import (
    QuestionCreate,
    QuestionResponse
)

from app.services.question_service import (
    QuestionService
)

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


@router.post(
    "/",
    response_model=QuestionResponse
)
def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db)
):
    service = QuestionService(db)

    return service.create_question(
        question_data
    )
