from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from casebook.db import get_session
from casebook.domain.checklist_item import ChecklistItem
from casebook.mapping.checklist_item import apply_checklist_item, checklist_item_from_row
from casebook.persistence.checklist_item import ChecklistItemRow
from casebook.schemas.checklist_item import (
    ChecklistItemResponse,
    CreateChecklistItemRequest,
    UpdateChecklistItemRequest,
)

router = APIRouter()


def response_from_item(item: ChecklistItem) -> ChecklistItemResponse:
    return ChecklistItemResponse.model_validate(item.model_dump())


async def get_row(session: AsyncSession, item_id: int) -> ChecklistItemRow:
    row = await session.get(ChecklistItemRow, item_id)
    if row is None:
        raise HTTPException(status_code=404)
    return row


@router.get("/checklist-items", response_model=list[ChecklistItemResponse])
async def list_checklist_items(
    session: AsyncSession = Depends(get_session),
) -> list[ChecklistItemResponse]:
    rows = (
        await session.execute(select(ChecklistItemRow).order_by(ChecklistItemRow.id))
    ).scalars().all()
    return [response_from_item(checklist_item_from_row(row)) for row in rows]


@router.post("/checklist-items", response_model=ChecklistItemResponse, status_code=201)
async def add_checklist_item(
    body: CreateChecklistItemRequest,
    session: AsyncSession = Depends(get_session),
) -> ChecklistItemResponse:
    row = ChecklistItemRow(text=body.text, completed=False)
    session.add(row)
    await session.commit()
    return response_from_item(checklist_item_from_row(row))


@router.patch("/checklist-items/{item_id}", response_model=ChecklistItemResponse)
async def update_checklist_item(
    item_id: int,
    body: UpdateChecklistItemRequest,
    session: AsyncSession = Depends(get_session),
) -> ChecklistItemResponse:
    row = await get_row(session, item_id)
    apply_checklist_item(row, checklist_item_from_row(row).model_copy(update={"text": body.text}))
    await session.commit()
    return response_from_item(checklist_item_from_row(row))


@router.post("/checklist-items/{item_id}/complete", response_model=ChecklistItemResponse)
async def complete_checklist_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> ChecklistItemResponse:
    row = await get_row(session, item_id)
    apply_checklist_item(row, checklist_item_from_row(row).model_copy(update={"completed": True}))
    await session.commit()
    return response_from_item(checklist_item_from_row(row))


@router.delete("/checklist-items/{item_id}", status_code=204)
async def remove_checklist_item(
    item_id: int,
    session: AsyncSession = Depends(get_session),
) -> Response:
    row = await get_row(session, item_id)
    await session.delete(row)
    await session.commit()
    return Response(status_code=204)
