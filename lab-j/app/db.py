import sqlite3
from pathlib import Path

import click
from flask import current_app, g


def get_db() -> sqlite3.Connection:
    if "db" not in g:
        g.db = sqlite3.connect(current_app.config["DATABASE"])
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    db = get_db()
    schema_path = Path(__file__).resolve().parent.parent / "migrations" / "001_create_movie.sql"
    db.executescript(schema_path.read_text(encoding="utf-8"))
    db.commit()


@click.command("init-db")
def init_db_command() -> None:
    init_db()
    click.echo("Initialized the SQLite database.")


def init_app(app) -> None:
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

