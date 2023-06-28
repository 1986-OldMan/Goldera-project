const mongoose = require('mongoose');
const slugify = require('slugify');
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
        required: [true , 'A product must have stock']
    },

    nextStock: {
        type: [Date] ,
        require: [true , 'Require next stock for products']
    },

    images: [String],

    createdAt: {
        type: Date ,
        default: Date.now(),
        // select: false
    },

} , {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual property in schema
// Created function for delivery date who put order in that day + day for delivery
productSchema.virtual('deliveryDate').get(function() {
    const orderDate = new Date(this.createdAt);
    const deliveryDate = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000));
    return deliveryDate;
});

  
  

//Creating documents and testing the model(Schema)
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;