import uuid

from sqlalchemy import Integer
from sqlalchemy import ForeignKey
from sqlalchemy import Date

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class UsageTracking(Base):
    __tablename__ = "usage_tracking"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    quizzes_generated: Mapped[int] = mapped_column(
        Integer,
        default=0
    )

    usage_date: Mapped[Date] = mapped_column(
        Date
    )
