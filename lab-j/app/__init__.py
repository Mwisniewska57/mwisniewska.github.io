from pathlib import Path

from flask import Flask

from app import db


def create_app(test_config: dict | None = None) -> Flask:
    base_dir = Path(__file__).resolve().parent.parent
    app = Flask(
        __name__,
        template_folder=str(base_dir / "templates"),
        static_folder=str(base_dir / "static"),
        static_url_path="",
    )

    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=str(base_dir / "data.db"),
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    from app.routes import bp as movies_bp

    app.register_blueprint(movies_bp)

    with app.app_context():
        db.init_db()

    return app

