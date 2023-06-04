const mongoose = require('mongoose');
const {Schema} = mongoose;

//Create a schema for products
const productSchema = new mongoose.Schema({

    idProduct: {
        type: Number ,
    },

    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true
    },

    price: {
        type: Number ,
        required: [true , 'A product must have a name']
    },

    description: {
        type: String ,
        required: [true , 'A product must have a description']
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
        type: Number ,
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
        default: Date.now()
    },

});

//Creating documents and testing the model(Schema)
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;