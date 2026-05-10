import uuid

from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.models.base import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    event_type: Mapped[str] = mapped_column(
        String(100)
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True)
    )

    value: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )
