const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apiFeature');

// Middlewares for gold and silver product ---------->
exports.aliasGoldProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Gold-Au'
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images'
  next()
};

exports.aliasSilverProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Silver-Ag'
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images'
  next()
};
// Middlewares for gold and silver product ---------->

exports.getAllProducts = async (req , res) => {
 try{

  // Execute the Query
  const features = new APIFeatures(Product.find() , req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();
  const products = await features.query

  //Send response 
  res.status(200).json({
    status : 'success' ,
    result: products.length ,
    data: {
      products
    }
  });
 } catch (err) {
   res.status(404).json({
    status: 'fail' ,
    message: err
  });
 }
};

exports.getProduct = async (req , res) => {
 try {
  const product = await Product.findById(req.params.id);
  // For MongoDB and line of code wrote above have reference for the id of product in database: Product.findOne({_id: req.params.id}).
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
 } catch (err) {
   res.status(404).json({
    status: 'fail' ,
    message: err
  });
 }
};

//create new product in other way and using async ,try and catch.
exports.createProduct = async (req , res) => {
  try{
    const newProduct = await Product.create(req.body);
    //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
    res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    }
  });
 } catch (err) {
  res.status(400).json({
    status: 'fail' , 
    message: err
  });
 }
};

exports.updateProduct = async (req , res) => {
 try {
  const product = await Product.findByIdAndUpdate(req.params.id , req.body , {
    new: true ,
    //if true, runs update validators on this command. Update validators validate the update operation against the model's schema
    runValidators: true
  })
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    data: {
      product
    },
  });
 } catch (err) {
  res.status(400).json({
  status: 'fail' ,
  message: err
  });
 }
};

exports.deleteProduct = async (req , res) => {
try {
  await Product.findByIdAndDelete(req.params.id);
  
  //The HTTP 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page
  res.status(204).json({
    status: "success",
    data: null,
  });
} catch (err) {
  res.status(400).json({
    status : 'fail' ,
    message: err
  });
 }
};

exports.getProductsStats = async (req , res) => {
  try {
   //Performs aggregation operation using the aggregation pipeline.
   //The pipeline allows users to process data from a collection or other source with a sequence of stage-based manipulations.
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

  } catch (err) {
    res.status(404).json({
      status: 'fail' ,
      message: err
    });
    console.log(err);
  }
};