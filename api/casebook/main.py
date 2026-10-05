from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from casebook.api.checklist import router as checklist_router
from casebook.api.health import router as health_router
from casebook.config import settings

app = FastAPI(title="Casebook", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"],
)
app.include_router(health_router)
app.include_router(checklist_router)
