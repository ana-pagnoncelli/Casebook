from sqlalchemy import Identity
from sqlalchemy.orm import Mapped, mapped_column

from casebook.persistence.base import Base


class ChecklistItemRow(Base):
    __tablename__ = "checklist_items"

    id: Mapped[int] = mapped_column(Identity(), primary_key=True)
    text: Mapped[str]
    completed: Mapped[bool] = mapped_column(default=False)
