/* eslint-disable eol-last */
class E403 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = E403;