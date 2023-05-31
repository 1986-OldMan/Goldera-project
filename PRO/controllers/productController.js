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

exports.checkBody = (req , res , next) => {
   if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status : 'fail',
      requestedAt: req.requestTime ,
      message: 'Missing name or price'
    });
  }
  next()
};

exports.getAllProducts = (req , res) => {

  res.status(200).json({
    status: "successfully added the products in list",
    requestedAt: req.requestTime ,
    // result: products.length ,
    // data: {
    //   products,
    // },
  });
};

exports.getProduct = (req , res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // const product = products.find((el) => el.id === id);
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     product,
  //   },
  // });
};

exports.createProduct = (req , res) => {
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    }
  });
};

exports.updateProduct = (req , res) => {
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