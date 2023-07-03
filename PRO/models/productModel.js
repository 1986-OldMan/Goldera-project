const mongoose = require('mongoose');
const slugify = require('slugify');
const {Schema} = mongoose;

/**
    * @author Alexandru Ivanescu <ivanescu.alexandru01@gmail.com>
    * Create schema for products using mongoose and mondodb.
    * Type: Schema.Types.Mixed - it's to used in schema number or string in the same place.
    * The enum validator is an array that will check if the value given is an item in the array.
    * The trim in white spaces will be removed from both sides of the string.
*/

const productSchema = new mongoose.Schema({

    idProduct: {
        type: Number ,
        select: false
    },

    name: {
        type: String ,
        required: [true , 'A product must have a name'] ,
        unique: true,
        trim: true,
        maxLength: [50 , 'A product must have less or equal then 40 characters'],
        minLenght: [10 , 'A product must have more or equal then 10 characters']
    },

    slug: String ,

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
    }

} , {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

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
  *DOCUMENT MIDDLEWARE: runs before the save [ .save() ] command or create [ .create() ] command
  *NOT WORK WITH .insertmany() , updateMany() , .findById() , .findByIdAndUpdate() , .findOne()
*/
productSchema.pre('save' , function(next) {
    this.slug = slugify(this.name , { lower: true });
    next();
});

/**
  *QUERY MIDDLEWARE
  *product.Schema.pre('find' , function(next) {
  * /^find/: is used to match any query operation that starts with 'find'
*/
productSchema.pre(/^find/ , function(next) {
    this.find({ rareProduct: { $ne: true} });
    this.start = Date.now();
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