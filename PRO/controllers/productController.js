// const fs = require("fs");
const Product = require('./../models/productModel');

// const products = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/products-simple.json`));

// exports.checkID = (req , res , next , val) => {
//   console.log(`Product id is ${val}`);
  
//   if (req.params.id * 1 > products.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// }

// exports.checkBody = (req , res , next) => {
//    if(!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status : 'fail',
//       requestedAt: req.requestTime ,
//       message: 'Missing name or price'
//     });
//   }
//   next()
// };

exports.getAllProducts = async (req , res) => {
 try{
  const products = await Product.find()
  //To find all products in database use find() methode. In mongoSH/mongoDB use this : db.NAME_COLLECTION.find()

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
  // For MongoDB and line of code wrote in line 50 have reference for the id of product in database: Product.findOne({_id: req.params.id}).
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

exports.updateProduct = (req , res) => {

  //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    data: {
      product: "Update product..."
    },
  });
  console.log("updated product is complete!");
};

exports.deleteProduct = (req , res) => {
 
  //The HTTP 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page
  res.status(204).json({
    status: "success",
    data: null,
  });
};