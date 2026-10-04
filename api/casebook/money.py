from decimal import Decimal
from typing import Annotated

from pydantic import Field
from sqlalchemy import Numeric

MONEY_PRECISION = 19
MONEY_SCALE = 4

Money = Annotated[
    Decimal,
    Field(
        allow_inf_nan=False,
        max_digits=MONEY_PRECISION,
        decimal_places=MONEY_SCALE,
    ),
]


def money_column_type() -> Numeric[Decimal]:
    return Numeric(MONEY_PRECISION, MONEY_SCALE)
