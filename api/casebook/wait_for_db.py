import os
import time

import psycopg


def main() -> None:
    database_url = os.environ["DATABASE_URL"].replace("postgresql+psycopg://", "postgresql://", 1)
    last_error: Exception | None = None
    for _ in range(30):
        try:
            with psycopg.connect(database_url) as connection:
                connection.execute("SELECT 1")
            return
        except Exception as exc:
            last_error = exc
            time.sleep(1)
    raise SystemExit(f"database did not become ready: {last_error}")


if __name__ == "__main__":
    main()
