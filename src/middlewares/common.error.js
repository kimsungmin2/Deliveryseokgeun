class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class SyntaxError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "SyntaxError";
  }
}

class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "ReadError";
  }
}
