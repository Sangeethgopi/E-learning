from sqlalchemy.orm import Session

from app.repositories.question_repository import (
    QuestionRepository
)

from app.schemas.question import QuestionCreate


class QuestionService:

    def __init__(self, db: Session):
        self.repository = QuestionRepository(db)

    def create_question(
        self,
        question_data: QuestionCreate
    ):
        return self.repository.create_question(
            question_data
        )
