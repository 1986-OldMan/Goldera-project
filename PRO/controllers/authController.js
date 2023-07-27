/**
    * authController it's for create new user with route Sign Up and post methode.
    * catchAsync for catch error in care something is wrong.
    * For more information about catchAsync , have section in PRO/utils/catchAsync.js.
    * JWT, or JSON Web Token, is an open standard used to share security information between two parties — a client and a server.
    * Each JWT contains encoded JSON objects, including a set of claims
    * jwt.sing it's for new user and referance is _id from mongodb.
*/
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
   return jwt.sign({ id } , process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRES_IN});
};

exports.signup = catchAsync(async (req , res , next) => {
    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm
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