from datetime import datetime

from sqlalchemy import Row

from casebook.domain.health import Health


def health_from_row(row: Row[tuple[datetime]]) -> Health:
    checked_at = row._mapping["checked_at"]
    if not isinstance(checked_at, datetime) or checked_at.tzinfo is None:
        raise ValueError("checked_at must be timestamptz")
    return Health(checked_at=checked_at)
