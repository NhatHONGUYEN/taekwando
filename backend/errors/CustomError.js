class CustomError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  BadRequestError,
};
