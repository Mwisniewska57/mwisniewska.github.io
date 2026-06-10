"""Compatibility entrypoint for IDE run configuration."""

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app import create_app

app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

