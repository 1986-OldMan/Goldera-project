const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

/*
 * Use mergeParams to merge with product routes to see review from produts.
 * Nested routes
*/
const router = express.Router({ mergeParams: true });

/*
 * Protect all routes with this protect middleware
*/
router.use(authController.protect)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user') , reviewController.setProductUserIds , reviewController.createReview);

router.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('user' , 'admin') , reviewController.UpdateReview)
.delete(authController.restrictTo('user' , 'admin') , reviewController.deleteReview);

module.exports = router;