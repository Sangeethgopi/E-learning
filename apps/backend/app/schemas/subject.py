from uuid import UUID
from pydantic import BaseModel


class SubjectCreate(BaseModel):
    name: str
    description: str | None = None
    icon: str | None = None


class SubjectResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    icon: str | None

    class Config:
        from_attributes = True
