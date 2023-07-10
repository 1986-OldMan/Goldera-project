/**
 * Implementing better Middleware for error handling
 * This middleware is exported and used in app.js
*/
module.exports = (err , req , res , next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  };