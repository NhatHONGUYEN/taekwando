export class CustomError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
