const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Middlewares for gold and silver product ---------->
exports.aliasGoldProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Gold-Au';
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images';
  next();
};

exports.aliasSilverProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Silver-Ag';
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images';
  next();
};
// Middlewares for gold and silver product ---------->

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product , { path: 'reviews' });
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);


/**
 * Performs aggregation operation using the aggregation pipeline.
 * The pipeline allows users to process data from a collection or other source with a sequence of stage-based manipulatio
 * The $group : stage separates documents into groups according to a "group key". The output is one document for each unique group key.
*/
exports.getProductsStats = catchAsync(async (req , res , next) => {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$alloy' ,
          nameProducts: { $addToSet: '$name'} ,
          numProducts: { $sum: 1 },
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'},
        }
      }
    ]);
    res.status(200).json({
      status: 'success' ,
      message: stats
    });
    console.log(stats);
});

/**
 * $unwind : Deconstructs an array field from the input documents to output a document for each element.
 * Each output document is the input document with the value of the array field replaced by the elemeny.
 * $matck : Filters the documents to pass only the documents that match the specified conditions to the next pipeline stage.
*/
exports.getNextStock = catchAsync(async (req , res , next) => {
    const year = req.params.year * 1
    const nextStock = await Product.aggregate([
      {
        $unwind: '$nextStock'
      },
      {
        $match: {
          nextStock: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {$month: '$nextStock'},
          numProducts: { $sum: 1 },
          products: { $push: '$name' }
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
       //Passes along the documents with the requested fields to the next stage in the pipeline.
       //The specified fields can be existing fields from the input documents or newly computed fields.
        $project: {
          _id: 0
        }
      },
      {
        $sort: { month: 1 } 
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        nextStock
      }
    });
    console.log(nextStock);
});