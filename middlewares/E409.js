/* eslint-disable eol-last */
class E409 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = E409;