/* eslint-disable eol-last */
class E404 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = E404;