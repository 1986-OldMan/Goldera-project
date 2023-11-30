const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    review: {
        type: String ,
        require: [true , 'Review can not be empty!']
    } ,

    rating: {
        type: Number ,
        min: 1 ,
        max: 5
    } ,

    createdAt: {
        type: Date ,
        default: Date.now()
    } ,

    products: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true , 'Review must belong to a products.']
    } ,

    user: {
        type: mongoose.Schema.ObjectId ,
        ref: 'User' , 
        required: [true , 'Review must belong to a user.']
            
    }
} , {
    toJSON: { virtuals: true} ,
    toObject: {virtuals: true}
});

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;