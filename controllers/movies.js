/* eslint-disable eol-last */
const Movie = require('../models/movie');

const E404 = require('../middlewares/E404');
const E403 = require('../middlewares/E403');
const E400 = require('../middlewares/E400');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new E400('Переданы некорректные данные.'));
      }
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    nameRU,
    nameEN,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new E400('Переданы некорректные данные.'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new E404('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (req.user._id.toString() === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.status(200).send({ message: 'Фильм удалён.' }));
      }
      throw new E403('Невозможно удалить чужой фильм.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new E400('Переданы некорректные данные.'));
      }
      next(err);
    });
};