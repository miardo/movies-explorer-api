/* eslint-disable eol-last */
class E401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = E401;