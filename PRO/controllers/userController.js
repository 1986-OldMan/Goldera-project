const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

/**
 * This filter Object si used for search in all elements and allowed specific fields to return.
 * Like allowed fields name and not password!
 * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
const filterObj = (obj , ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj
};

exports.getAllUsers = catchAsync(async (req , res , next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users 
        }
    })
});

/**
 * Middleware for update user data ,like name , email and not password!!
 * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
exports.UpdateMe = catchAsync(async(req , res , next) => {
  // 1) Create error if user posts password data.
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword' , 400));
  };

   // 2) Filter our unwanted fields names that are not allowed to be updated.
   const filteredBody = filterObj(req.body , 'name' , 'email');

   // 3) Update user document.
  const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , { new: true , runValidators: true });

  res.status(200).json({
    status: 'success' , 
    data: {
      user: updatedUser
    }
  });
});

/**
 * Middleware for delete user , but not delete from database.
 * Mark in database user with active: false to see the current user have disable the account.
 * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
 exports.deleteMe = catchAsync(async (req , res ,next) => {
  await User.findByIdAndUpdate(req.user.id , { active: false })

  res.status(204).json({
    status: 'success' ,
    data: null
  });
});
  
  exports.getUser = (req , res) => {
    res.status(500).json({
      status: 'error' ,
      message: 'This route is not defined!'
    })
  };
  
  exports.createUser = (req , res) => {
    res.status(500).json({
      status: 'error' ,
      message: 'This route is not defined!'
    })
  };
  
  exports.updateUser = (req , res) => {
    res.status(500).json({
      status: 'error' ,
      message: 'This route is not defined!'
    })
  };
  
  exports.deleteUser = (req , res) => {
    res.status(500).json({
      status: 'error' ,
      message: 'This route is not defined!'
    })
  };