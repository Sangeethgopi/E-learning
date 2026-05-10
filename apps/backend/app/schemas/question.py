from uuid import UUID

from pydantic import BaseModel


class QuestionOptionCreate(BaseModel):
    option_text: str
    is_correct: bool = False


class QuestionCreate(BaseModel):
    quiz_id: UUID
    question_text: str
    question_type: str = "mcq"
    correct_answer: str
    explanation: str | None = None
    options: list[QuestionOptionCreate]


class QuestionResponse(BaseModel):
    id: UUID
    quiz_id: UUID
    question_text: str
    question_type: str
    explanation: str | None

    class Config:
        from_attributes = True
