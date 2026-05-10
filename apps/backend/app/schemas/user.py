from uuid import UUID

from pydantic import BaseModel
from pydantic import EmailStr


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    xp_points: int
    streak_count: int

    class Config:
        from_attributes = True
