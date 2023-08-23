const express = require("express");
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) GLOBAL MIDDLEWARES------------------------------------------------------------------------------------------------------------------->
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log('You are in : ' + process.env.NODE_ENV);

/**
   * Middleware for limit of user in case for many requests.
   * This middleware work in routes where '/api' exist http requests! and limit to 100 requests.
   * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
 */
const limiter = rateLimit({
  max: 100 ,
  windowMs: 60 * 60 * 1000 ,
  message: 'To many requests from this IP , Please try again in an hour!'
});
app.use('/api' , limiter);

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//2) ROUTES------------------------------------------------------------------------------------------------------------------------>
app.use('/api/v1/products' , productRouter);
app.use('/api/v1/users' , userRouter);

/**
   * Middleware for the routes is not define.
   * .all is used to all HTTP methods (get , post , patch , delete and continue).
   * the '*' it's used for the all URL's to catch.
   * Creates a new Error object and sets the error.message property to the provided text message.
 */
app.all('*' , (req , res , next) => {

  // 1) First build:
  // res.status(404).json({
  //   status: 'fail' ,
  //   message: `Can't find ${req.originalUrl} on the server!`
  // })

  // 2) Second build:
  // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // 3) Third build:
  next(new AppError(`Can't find ${req.originalUrl} on the server!` , 404));
});

/**
 * Implementing better global Middleware for error handling.
*/
app.use(globalErrorHandler);

module.exports = app;
