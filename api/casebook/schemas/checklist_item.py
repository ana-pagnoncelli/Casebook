from pydantic import BaseModel, ConfigDict, Field


class CreateChecklistItemRequest(BaseModel):
    model_config = ConfigDict(frozen=True)

    text: str = Field(min_length=1)


class UpdateChecklistItemRequest(BaseModel):
    model_config = ConfigDict(frozen=True)

    text: str = Field(min_length=1)


class ChecklistItemResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: int
    text: str
    completed: bool
