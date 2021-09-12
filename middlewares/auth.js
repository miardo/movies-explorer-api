/* eslint-disable eol-last */
const jwt = require('jsonwebtoken');

const E401 = require('./E401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!token) {
    next(new E401('Необходима авторизация.'));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new E401('Необходима авторизация.'));
  }

  req.user = payload;
  next();
};