from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from casebook.db import get_session
from casebook.mapping.health import health_from_row
from casebook.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health(session: AsyncSession = Depends(get_session)) -> HealthResponse:
    row = (await session.execute(select(func.now().label("checked_at")))).one()
    return HealthResponse(status="ok", checked_at=health_from_row(row).checked_at)
