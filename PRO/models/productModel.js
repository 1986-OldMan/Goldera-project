const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// const User = require('../models/userModel');

const {Schema} = mongoose;

/**
    * @author Alexandru Ivanescu <ivanescu.alexandru01@gmail.com>
    * Create schema for products using mongoose and mongodb.
    * Type: Schema.Types.Mixed - it's to used in schema number or string in the same place.
    * The enum validator is an array that will check if the value given is an item in the array.
    * The trim in white spaces will be removed from both sides of the string.
    * type: mongoose.Schema.ObjectId => to get the document ID from MongoDB.
    * The ref is using for referance.
*/

const productSchema = new mongoose.Schema({
    
    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true,
        trim: true,
        maxLength: [75 , 'A product must have less or equal then 75 characters'],
        minLenght: [10 , 'A product must have more or equal then 10 characters'],
    },

    slug: String ,

    price: {
        type: Number ,
        required: [true , 'A product must have a price']
    },

    description: {
        type: String ,
        required: [true , 'A product must have a description'],
        trim: true
    },
    
    manufacturer: {
        type: String ,
        required: [true , 'A product must have a manufacturer'],
        trim: true
    },

    alloy: {
        type: String ,
        required:[true , 'A product must have type of alloy'],
        enum: {
            values: ['Gold-Au' , 'Silver-Ag' , 'Platinum-Pt'],
            message: 'You can only choose between Gold-Au, Silver-Ag and Platinum-Pt'
        }
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
        select: false
    },

    rareProduct: {
        type: Boolean,
        default: false
    },

    employee: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]

} , {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


/**
    * An index is a data structure that improves the speed of queries on a collection.
    * Indexes are defined at the schema level and can be applied to one or more fields.
    * Defining indexes in Mongoose allows you to optimize the performance of your queries and is an essential part of designing a MongoDB schema for efficient data retrieval.
*/
productSchema.index({ price: 1 });
productSchema.index({ price: 1 , weight: 1 });
productSchema.index({ price: 1 , stock: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ weight: 1 });
productSchema.index({ stock : 1 });


/**
  * Virtual property in schema
  * Created function for sell customers back to us the product.    
*/
productSchema.virtual('SellPrice').get(function() {
    const price = this.price
    const sellPrice = price - (price * 0.06);
    return sellPrice;
});

/**
  * Virtual populate
  * To connect the productModel with review model
    foreignField: => is to connect to models, in this exemple review with product.
  * In review model have reference(ref) called product and connect to reference Product.
*/
productSchema.virtual('reviews' , {
    ref: 'Review' ,
    foreignField: 'products',
    localField: '_id'
});

/**
  *DOCUMENT MIDDLEWARE: runs before the save [ .save() ] command or create [ .create() ] command
  *NOT WORK WITH .insertmany() , updateMany() , .findByIdAndUpdate() , .findOne()
*/
productSchema.pre('save' , function(next) {
    this.slug = slugify(this.name , { lower: true });
    next();
});

/**
  * This section is for employee who introduce new product!
  * Used Promise.all , because this section is a promise => "this.employee.map(async id => await User.findById(id))"
*/
// productSchema.pre('save' , async function(next) {
//     const employeePromises = this.employee.map(async id => await User.findById(id));
//     this.employee = await Promise.all(employeePromises);
//     next();
// });

/**
  *QUERY MIDDLEWARE
  *product.Schema.pre('find' , function(next) {
  * /^find/: is used to match any query operation that starts with 'find'
  *populate() is the process of automatically replacing the specified paths in the document with documents from other collections.
*/
productSchema.pre(/^find/ , function(next) {
    this.find({ rareProduct: { $ne: true} });
    this.start = Date.now();
    next();
});

productSchema.pre(/^find/ , function(next) {
    this.populate({
        path: 'employee' ,
        select: '-__v -passwordChangeAt'
      });

    next();
});

productSchema.post(/^find/ , function(docs , next) {
    console.log(`Query took ${Date.now() - this.start} ms`);
    console.log(docs);
    next();
});


/**
  *AGGREGATION MIDDLEWARE
*/
productSchema.pre('aggregate' , function(next) {
    this.pipeline().unshift({ $match: { rareProduct: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

/**
  *Creating documents and testing the model(Schema)
*/
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;