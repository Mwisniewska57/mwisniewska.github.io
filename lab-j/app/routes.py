from flask import Blueprint, abort, redirect, render_template, request, url_for

from app.db import get_db

bp = Blueprint("movies", __name__)


@bp.route("/")
def home():
    return render_template("index.html", title="Home")


@bp.route("/movie")
def movie_index():
    db = get_db()
    movies = db.execute("SELECT id, title, director FROM movie ORDER BY id DESC").fetchall()
    return render_template("movies/index.html", title="Movie list", bodyClass="index", movies=movies)


@bp.route("/movie/new")
def movie_new():
    return render_template("movies/new.html", title="Add Movie", bodyClass="edit")


@bp.route("/movie/create", methods=["POST"])
def movie_create():
    title = request.form.get("title", "").strip()
    director = request.form.get("director", "").strip()
    if not title or not director:
        return render_template(
            "movies/new.html",
            title="Add Movie",
            bodyClass="edit",
            error="Title and Director are required.",
            movie={"title": title, "director": director},
        ), 400

    db = get_db()
    cursor = db.execute("INSERT INTO movie(title, director) VALUES (?, ?)", (title, director))
    db.commit()
    return redirect(url_for("movies.movie_show", movie_id=cursor.lastrowid))


@bp.route("/movie/<int:movie_id>")
def movie_show(movie_id: int):
    db = get_db()
    movie = db.execute(
        "SELECT id, title, director FROM movie WHERE id = ?",
        (movie_id,),
    ).fetchone()
    if movie is None:
        abort(404)
    return render_template(
        "movies/show.html",
        title=f"{movie['title']} ({movie['id']})",
        bodyClass="show",
        movie=movie,
    )


@bp.route("/movie/<int:movie_id>/edit")
def movie_edit(movie_id: int):
    db = get_db()
    movie = db.execute(
        "SELECT id, title, director FROM movie WHERE id = ?",
        (movie_id,),
    ).fetchone()
    if movie is None:
        abort(404)
    return render_template(
        "movies/edit.html",
        title=f"Edit Movie {movie['title']} ({movie['id']})",
        bodyClass="edit",
        movie=movie,
    )


@bp.route("/movie/<int:movie_id>/edit", methods=["POST"])
def movie_update(movie_id: int):
    title = request.form.get("title", "").strip()
    director = request.form.get("director", "").strip()
    if not title or not director:
        return render_template(
            "movies/edit.html",
            title=f"Edit Movie ({movie_id})",
            bodyClass="edit",
            error="Title and Director are required.",
            movie={"id": movie_id, "title": title, "director": director},
        ), 400

    db = get_db()
    updated = db.execute(
        "UPDATE movie SET title = ?, director = ? WHERE id = ?",
        (title, director, movie_id),
    )
    db.commit()
    if updated.rowcount == 0:
        abort(404)
    return redirect(url_for("movies.movie_show", movie_id=movie_id))


@bp.route("/movie/<int:movie_id>/delete", methods=["POST"])
def movie_delete(movie_id: int):
    db = get_db()
    deleted = db.execute("DELETE FROM movie WHERE id = ?", (movie_id,))
    db.commit()
    if deleted.rowcount == 0:
        abort(404)
    return redirect(url_for("movies.movie_index"))





