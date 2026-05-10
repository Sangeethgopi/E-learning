from pydantic import BaseModel


class PDFQuizResponse(BaseModel):
    quiz_id: str
    generated_questions: int
    status: str
