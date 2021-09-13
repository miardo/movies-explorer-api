/* eslint-disable eol-last */
require('dotenv').config();
const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const E404 = require('./middlewares/E404');

const corsOptions = {
  origin: [
    'https://diplom.karimov.nomoredomains.monster',
    'http://diplom.karimov.nomoredomains.monster',
    'https://api.diplom.karimov.nomoredomains.monster',
    'http://api.diplom.karimov.nomoredomains.monster',
    'https://localhost:3000',
  ],
  credentials: true,
  method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(35).required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new E404('Страница не найдена'));
});

app.use(handleErrors);

app.listen(PORT);