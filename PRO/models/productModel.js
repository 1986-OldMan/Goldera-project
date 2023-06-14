const mongoose = require('mongoose');
const {Schema} = mongoose;

//Create a schema for products

//type: Schema.Types.Mixed = it's for to have a number or string.
const productSchema = new mongoose.Schema({

    idProduct: {
        type: Number ,
        select: false
    },

    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true,
        trim: true
    },

    price: {
        type: Number ,
        required: [true , 'A product must have a name']
    },

    description: {
        type: String ,
        required: [true , 'A product must have a description'],
        trim: true
    },
    
    manufacturer: {
        type: String ,
        required: [true , 'A product must have a manufacturer']
    },

    alloy: {
        type: String ,
        required:[true , 'A product must have type of alloy']
    },

    weight: {
        type: Schema.Types.Mixed ,
        required: [true , 'A product must have a weight']
    },

    fineness: {
        type: Schema.Types.Mixed ,
        required: [true , 'A product must have fineness included']
    },

    dimensions: {
        type: Schema.Types.Mixed ,
        required: [true , 'A product must have dimensions included']
    },

    stock: {
        type: Schema.Types.Mixed ,
        required:[true , 'A product must have stock']
    },

    images: [String],

    createdAt: {
        type: Date ,
        default: Date.now(),
        select: false
    },

});

//Creating documents and testing the model(Schema)
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;