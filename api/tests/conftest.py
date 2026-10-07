import asyncio
import os
import sys
from collections.abc import AsyncIterator
from pathlib import Path

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

os.environ["DATABASE_URL"] = "postgresql+psycopg://casebook:casebook@localhost:5432/casebook_test"

import psycopg
import pytest
from alembic import command
from alembic.config import Config
from httpx import ASGITransport, AsyncClient

from casebook.main import app

ADMIN_URL = "postgresql://casebook:casebook@localhost:5432/casebook"
TEST_URL = "postgresql://casebook:casebook@localhost:5432/casebook_test"
API_ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="session", autouse=True)
def database() -> None:
    with psycopg.connect(ADMIN_URL, autocommit=True) as connection:
        exists = connection.execute(
            "SELECT 1 FROM pg_database WHERE datname = 'casebook_test'"
        ).fetchone()
        if exists is None:
            connection.execute("CREATE DATABASE casebook_test")
    config = Config(str(API_ROOT / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", os.environ["DATABASE_URL"])
    command.upgrade(config, "head")


@pytest.fixture(autouse=True)
def empty_checklist(database: None) -> None:
    with psycopg.connect(TEST_URL, autocommit=True) as connection:
        connection.execute("TRUNCATE TABLE checklist_items RESTART IDENTITY")


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as http:
        yield http
