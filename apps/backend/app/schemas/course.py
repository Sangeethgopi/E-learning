from uuid import UUID
from pydantic import BaseModel


class CourseCreate(BaseModel):
    subject_id: UUID
    title: str
    description: str | None = None
    difficulty: str = "beginner"


class CourseResponse(BaseModel):
    id: UUID
    subject_id: UUID
    title: str
    description: str | None
    difficulty: str

    class Config:
        from_attributes = True
