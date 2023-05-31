const mongoose = require('mongoose');

//Create a schema for products
const productSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true
    },

    price: {
        type: Number ,
        required: [true , 'A product must have a name']
    },

    id: {
        type: Number ,
        required: [true , 'A product must have an id']
    }
});

//Creating documents and testing the model(Schema)
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;