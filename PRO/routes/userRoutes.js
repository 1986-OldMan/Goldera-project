const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

/*
 * Route to define sign up and log in user.
*/
router.post('/signup' , authController.signup);
router.post('/login' , authController.login);

/*
 * Route to define forgot password and reset password.
*/
router.post('/forgotPassword' , authController.forgotPassword);
router.patch('/resetPassword/:token' , authController.resetPassword);

/*
  * Protect this routes afther this middleware(You need to login or signup!)
  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
router.use(authController.protect);


/*
 * Route for user for current user
*/
router.get('/me' , userController.getMe , userController.getUser);

/*
 * Route to define update password for user.
*/
router.patch('/updateMyPassword' , authController.updatePassword);

/*
 * Route to define update user data.
*/
router.patch('/updateMe' , userController.UpdateMe);

/*
 * Route to define for delete user , but not delete user from database.
*/
router.delete('/deleteMe' , userController.deleteMe);

/*
 * This is protected more by restriction and protect!
 * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/
router.use(authController.restrictTo('admin' , 'supervizor'))

/*
 * Generic route to user.
*/
router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;