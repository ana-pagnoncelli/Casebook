import json
from pathlib import Path

from casebook.main import app


def main() -> None:
    destination = Path.cwd() / "openapi.json"
    destination.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
