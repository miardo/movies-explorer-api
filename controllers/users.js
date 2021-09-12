/* eslint-disable eol-last */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const E404 = require('../middlewares/E404');
const E400 = require('../middlewares/E400');
const E409 = require('../middlewares/E409');
const E401 = require('../middlewares/E401');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new E404('Пользователь с указанным _id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new E400('Переданы некорректные данные.'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new E404('Пользователь с указанным _id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new E400('Переданы некорректные данные.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new E400('Переданы некорректные данные.'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new E409('Пользователь с таким email уже существует.'));
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
        });
    })
    .catch((err) => {
      if (err.statusCode === 500) {
        next(err);
      }
      next(new E401('Неправильные почта или пароль.'));
    });
};