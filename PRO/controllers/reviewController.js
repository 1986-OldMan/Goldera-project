const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.setProductUserIds = (req , res , next) => {
    // Allow nested routes
    if(!req.body.products) req.body.products = req.params.productId
    if(!req.body.user) req.body.user = req.user.id
    next()
}
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.UpdateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);