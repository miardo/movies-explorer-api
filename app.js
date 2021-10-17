/* eslint-disable eol-last */
require('dotenv').config();
const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');

const handleErrors = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: [
    'https://diplom.karimov.nomoredomains.monster',
    'http://diplom.karimov.nomoredomains.monster',
    'https://api.diplom.karimov.nomoredomains.monster',
    'http://api.diplom.karimov.nomoredomains.monster',
    'https://localhost:3000',
    'http://localhost:3000',
  ],
  credentials: true,
  method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);