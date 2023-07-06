const express = require("express");
const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1) MIDDLEWARES------------------------------------------------------------------------------------------------------------------->
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log('You are in : ' + process.env.NODE_ENV);

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2) ROUTES------------------------------------------------------------------------------------------------------------------------>
app.use('/api/v1/products' , productRouter);
app.use('/api/v1/users' , userRouter);

/**
   * Middleware for the routes is not define.
   * .all is used to all HTTP methods (get , post , patch , delete and continue).
   * the '*' it's used for the all URL's is catch
 */
app.all('*' , (req , res , next) => {
  res.status(404).json({
    status: 'fail' ,
    message: `Can't find ${req.originalUrl} on the server!`
  })
  next();
});

module.exports = app;
