/**
 * Implementing better Middleware for error handling.
 * This middleware is exported and used in app.js.
 * error.stack property provides a string representation of the stack trace associated with an error object. It shows the sequence of function calls that led to the occurrence of the error, including the function names, file names, and line numbers.
 * implementing error during development(sendErrorDev) vs production(sendErrorProd).
 * in sendErrorDev = recived all detail , message and code of error.
 * in sendErrorProd = in case error is operational you recived error code and error detail.
 *                  = in case error is not operation you recived error 500 and generic message.
 *                  = for more detail go to section appError.js in folder utils (PRO/utils/appError.js).
*/

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message , 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
    
    console.log(error);
  }
};