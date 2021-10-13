/* eslint-disable eol-last */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const E404 = require('../middlewares/E404');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(35).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

router.use('*', (req, res, next) => {
  next(new E404('Страница не найдена'));
});

module.exports = router;