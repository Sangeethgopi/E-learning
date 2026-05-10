from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.question_option import QuestionOption

from app.schemas.question import QuestionCreate


class QuestionRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_question(
        self,
        question_data: QuestionCreate
    ):
        question = Question(
            quiz_id=question_data.quiz_id,
            question_text=question_data.question_text,
            question_type=question_data.question_type,
            correct_answer=question_data.correct_answer,
            explanation=question_data.explanation
        )

        self.db.add(question)
        self.db.flush()

        for option_data in question_data.options:
            option = QuestionOption(
                question_id=question.id,
                option_text=option_data.option_text,
                is_correct=option_data.is_correct
            )

            self.db.add(option)

        self.db.commit()
        self.db.refresh(question)

        return question
