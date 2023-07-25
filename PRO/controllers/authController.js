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

exports.signup = catchAsync(async (req , res , next) => {
    const newUser = await User.create({
        name: req.body.name ,
        email: req.body.email ,
        password: req.body.password ,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id } , process.env.JWT_SECRET , {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(201).json({
        status : 'success',
        token ,
        data: {
            user: newUser
        }
    });
});