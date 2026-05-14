// to get structured errors we need api error handlers
class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: string[];

  constructor(
    statusCode: number,
    message: string,
    errors: string[] = [],
    stack: string = ""
  ) {
    // which is originally the Error constructor
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
// this is a comment

export { ApiError };
