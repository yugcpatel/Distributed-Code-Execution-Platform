class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Status is 'fail' for 400s (client error) and 'error' for 500s (server error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // We capture the stack trace to know exactly where the error originated,
    // excluding this constructor call from it to keep it clean.
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
