const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req , res , next) => {
    let filter = {};
    if(req.params.productId) filter = { products: req.params.productId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length ,
        data: {
            reviews
        }
    });
});

exports.setProductUserIds = (req , res , next) => {
     // Allow nested routes
     if(!req.body.products) req.body.products = req.params.productId
     if(!req.body.user) req.body.user = req.user.id
    next()
}
exports.createReview = factory.createOne(Review);
exports.UpdateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);