var express = require('express');
var router = express.Router();
const {DatabaseSync}=require('node:sqlite');
const path = require('node:path');
const dbPath = path.resolve(__dirname,'..','data.db');
const db= new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS movie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

router.get('/', function (req, res, next) {
    try {
        const movies = db.prepare('SELECT * FROM movie').all();
        res.render('layout', {
            bodyPartial: 'movies/index',
            title: 'Movie list',
            bodyClass: 'index',
            movies: movies
        });
    } catch (err) {
        next(err);
    }
});
router.get('/new', function (req, res) {
    res.render('layout', {
        bodyPartial: 'movies/new',
        title: 'Add Movie',
        bodyClass: 'new'
    });
});
router.post('/create',function (req, res,next){
try {
    const {title, director} = req.body;
    const result = db
        .prepare('INSERT INTO movie(title,director) VALUES (?,?)')
        .run(title, director);
    res.redirect('/movie/' + result.lastInsertRowid);
}catch(err){
    next(err);
}});
router.get('/:id', function (req, res, next) {
    try {
        const movie = db.prepare('SELECT * FROM movie WHERE id = ?').get(req.params.id);
        if (!movie) {
            return res.status(404).send('Nie znaleziono filmu');
        }
        res.render('layout', {
            bodyPartial: 'movies/show',
            title: `${movie.title} (${movie.id})`,
            bodyClass: 'show',
            movie: movie
        });
    } catch (err) {
        next(err);
    }
});
router.get('/:id/edit', function (req, res, next) {
    try {
        const movie = db.prepare('SELECT * FROM movie WHERE id = ?').get(req.params.id);
        if (!movie) {
            return res.status(404).send('Nie znaleziono filmu');
        }
        res.render('layout', {
            bodyPartial: 'movies/edit',
            title: `Edit Movie ${movie.title} (${movie.id})`,
            bodyClass: 'edit',
            movie: movie
        });
    } catch (err) {
        next(err);
    }
});
router.post('/:id/edit', function (req, res, next) {
    try {
        const { title, director } = req.body;
        db.prepare('UPDATE movie SET title = ?, director = ? WHERE id = ?')
            .run(title, director, req.params.id);

        res.redirect('/movie/' + req.params.id);
    } catch (err) {
        next(err);
    }
});
router.post('/:id/delete', function (req, res, next) {
    try {
        db.prepare('DELETE FROM movie WHERE id = ?').run(req.params.id);
        res.redirect('/movie');
    } catch (err) {
        next(err);
    }
});

module.exports = router;
