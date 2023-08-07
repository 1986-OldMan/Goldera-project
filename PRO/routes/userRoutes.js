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