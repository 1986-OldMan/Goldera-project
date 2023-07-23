/**
    * authController it's for create new user with route Sign Up and post methode.
    * catchAsync for catch error in care something is wrong.
    * For more information about catchAsync , have section in PRO/utils/catchAsunc.js
*/

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req , res , next) => {
    const newUser = User.create(req.body);

    res.status(201).json({
        status : 'success',
        data: {
            user: newUser
        }
    });
});