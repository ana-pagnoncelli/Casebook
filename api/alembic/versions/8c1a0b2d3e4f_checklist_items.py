"""checklist items

Revision ID: 8c1a0b2d3e4f
Revises:
Create Date: 2026-10-04

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "8c1a0b2d3e4f"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "checklist_items",
        sa.Column("id", sa.Integer(), sa.Identity(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_checklist_items"),
    )


def downgrade() -> None:
    op.drop_table("checklist_items")
