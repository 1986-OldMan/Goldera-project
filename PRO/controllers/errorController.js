/**
 * Implementing better Middleware for error handling.
 * This middleware is exported and used in app.js.
 * error.stack property provides a string representation of the stack trace associated with an error object. It shows the sequence of function calls that led to the occurrence of the error, including the function names, file names, and line numbers.
 * implementing error during development(sendErrorDev) vs production(sendErrorProd).
 * in sendErrorDev = recived all detail , message and code of error.
 * in sendErrorProd = in case error is operational you recived error code and error detail.
 *                  = in case error is not operation you recived error 500 and generic message.
 *                  = for more detail go to section appError.js in folder utils (PRO/utils/appError.js).
 *                  = in sendErrorProd exist following functions : handleCastErrorDB , handleDuplicateFieldsDB , handleValidationErrorDB.
 * handleCastErrorDB = received specific error in case used other id.
 * handleDuplicateFieldsDB = received specific error in case create new product with post method with the same name(error 11000 is for mongodb for duclicate fields).
 *                         = (/(["'])(\\?.)*?\1/) -> regular expression match text between quotes.
 * handleValidationErrorDB = an error is received when you update the product with other parameters than those specified in the moongose scheme(PRO/models/productModel.js).
 *                         = And to make it an order, join with point and a free space were used after each wrong parameter. 
 *                         = The map() method creates a new array populated with the results of calling a provided function on every element in the calling.
*/

const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message , 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match((/(["'])(\\?.)*?\1/));
  console.log(value);
  
  const message = `Duplicate filed value: ${value}. Please use other value.`
  return new AppError(message , 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid imput data. ${errors.join('. ')}`;
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
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
    sendErrorProd(error, res);
    
    console.log(error);
  }
};