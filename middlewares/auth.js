/* eslint-disable eol-last */
const jwt = require('jsonwebtoken');

const E401 = require('./E401');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new E401('Необходима авторизация.'));
  }

  const token = authorization;

  let payload;

  try {
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new E401('Необходима авторизация.'));
  }

  req.user = payload;

  next();
};