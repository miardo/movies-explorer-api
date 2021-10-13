/* eslint-disable eol-last */
class E400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = E400;