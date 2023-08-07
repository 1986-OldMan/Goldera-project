const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');


/**
 * catchAsync for catch error in care something is wrong.
 * For more information about catchAsync , have section in PRO/utils/catchAsync.js.
 * JWT, or JSON Web Token, is an open standard used to share security information between two parties — a client and a server.
 * Each JWT contains encoded JSON objects, including a set of claims
 * jwt.sing it's for new user and referance is _id from mongodb.
 * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/

const signToken = id => {
   return jwt.sign({ id } , process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRES_IN});
};

exports.signup = catchAsync(async (req , res , next) => {
    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm ,
        role: req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status : 'success',
        token ,
        data: {
            user: newUser
        }
    });
});

/**
  * const { email , password } = req.body it's the same , but without object destructuring or es6 destructuring.
  * const email = req.body.email
  * const password = req.body.password
  * 2) Find the user based on the provided email and include the 'password' field for comparison
  * 2) If user not found or the provided password is incorrect, send a 401 error (Unauthorized).
  * 3) Generate a token for the user's ID using the 'signToken' function.
  * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/

exports.login = catchAsync(async (req , res , next) => {
    const { email , password } = req.body;

    // 1) Check if email and password exist.
    if(!email || !password) {
       return next(new AppError('Please provide email and password!' , 400));
    }
    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    // const checkPassword = await user.correctPassword(password , user.password)

    if(!user || !(await user.correctPassword(password , user.password))) {
        return next(new AppError('Incorect email or password' , 401))
    };

    // 3) If everything ok , send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status : 'success',
        token 
    });
});

/**
  * Middleware for protect the router for all product.
  * It's necessary to log in to see the product
  * Sending Authorization Bearer Token Header. To send a request with the Bearer Token authorization header.
  * you need to make an HTTP request and provide your Bearer Token in the "Authorization: Bearer {token}" HTTP header.
  * Authentication Header verifies origin of data and also payload to confirm if there has been modification done in between, during transmission between source and destination. 
  * How to test to see if protect middleware work , using postman in Headers you have KEY and VALUE.
  * In key introduce Authorization and in Value introduce Bearer and token.
  * const { promisify } : ->
  * -> Import the 'promisify' function from Node.js's built-in 'util' module.
  * -> Destructuring Assignment: Extract the 'promisify' function from the 'util' module.
  * -> The 'promisify' function helps convert traditional callback-style functions into Promise-based functions.
  * -> jwt.verify is a function commonly used in the context of JSON Web Tokens (JWT) to verify the authenticity and integrity of a token.
  * 
  * decoded.iat: This is the "issued at" timestamp extracted from the decoded JWT payload. It represents the time when the JWT was issued.
  * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
exports.protect = catchAsync(async (req , res , next) => {
    // 1) Getting the token and check of it's there.
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);

    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.' , 401));
    }
    
    // 2) Verification token.
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET);

    // 3) Check if user still exists.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError("The user assigned to this token does no longer exist" , 401));
    }

    // 4) Check if user change password after the jwt token was issued.
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
      }

   // GRAND ACCESS TO PROTECTED ROUTE.
   req.user = currentUser;
    next()
});

/**
    * restricTo is for if certain role have action de modified , add , delete products.
    * (...roles) = to accept a variable number of arguments as an array.
    * roles to modified , add , delete product is admin and supervisor.
    * roles ['admin' , 'supervisor']. !role = 'user' 
    * The HTTP status code for this error is set to 403 (Forbidden).
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
exports.restrictTo = (...roles) => {
    return (req , res , next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do no have permision to perform this action' , 403));
        }
        next();
    };
};

/**
    * forgot password used findOne from mongoose.
    * validateBeforeSave = it's from mongoose to disable automatic validation before saving.
    * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/

exports.forgotPassword = catchAsync(async (req , res , next) => {
    // 1) Get user based on posted email.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email adress' , 404));
    };

    // 2) Generate the random reset token.
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) send if to user email.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfrim to: ${resetURL}.
    \nIf you didn't forget your password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email ,
            subject: 'Your password reset token (valid for 10 min)' ,
            message
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });

    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!') , 500);
    }
});

exports.resetPassword = (req , res , next) => {};