FROM python:3.13-slim

WORKDIR /app

COPY pyproject.toml .
COPY casebook ./casebook
COPY alembic.ini .
COPY alembic ./alembic

RUN pip install --no-cache-dir .

EXPOSE 8000

CMD ["sh", "-c", "python -m casebook.wait_for_db && alembic upgrade head && uvicorn casebook.main:app --host 0.0.0.0 --port 8000"]
