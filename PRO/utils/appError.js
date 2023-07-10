/**
   * Class for Error handler.
   * The AppError class extends the Error class, which provides basic error functionality.
   * In the context of the AppError class, super is used to call the constructor of the parent class, which in this case is the built-in Error class.
   * The isOperational property is set to true to indicate that this is an operational error.
   * The status property is determined based on the statusCode. If the statusCode starts with '4' (indicating a client error), the status is set to 'fail'; otherwise, it is set to 'error.
   * Error.captureStackTrace(this, this.constructor) captures the stack trace of the error object.
 */
class AppError extends Error {
    constructor(message , statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this , this.constructor);
    }
}

module.exports = AppError;