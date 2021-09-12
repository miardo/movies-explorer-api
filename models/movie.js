/* eslint-disable eol-last */
const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return validator.isURL(link, { require_protocol: true });
      },
      message: 'Некорректный формат ссылки.',
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return validator.isURL(link, { require_protocol: true });
      },
      message: 'Некорректный формат ссылки.',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator(link) {
        return validator.isURL(link, { require_protocol: true });
      },
      message: 'Некорректный формат ссылки.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);