from pydantic import BaseModel, ConfigDict


class ChecklistItem(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: int
    text: str
    completed: bool
