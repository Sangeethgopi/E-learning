import uuid

from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Boolean

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from app.models.base import Base
from app.models.base import TimestampMixin


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id")
    )

    stripe_customer_id: Mapped[str] = mapped_column(
        String(255)
    )

    stripe_subscription_id: Mapped[str] = mapped_column(
        String(255)
    )

    plan_name: Mapped[str] = mapped_column(
        String(50),
        default="free"
    )

    active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    user = relationship("User")
