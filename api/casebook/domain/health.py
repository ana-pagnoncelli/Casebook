from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Health(BaseModel):
    model_config = ConfigDict(frozen=True)

    checked_at: datetime
