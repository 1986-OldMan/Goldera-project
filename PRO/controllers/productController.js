const Product = require('./../models/productModel');

// Middlewares for gold and silver product ---------->
exports.aliasGoldProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Gold-Au'
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images'
  next()
}

exports.aliasSilverProduct = (req , res , next) => {
  req.query.limit = 10 ;
  req.query.sort = 'alloy';
  req.query.alloy = 'Silver-Ag'
  req.query.fields = 'name,price,alloy,manufacturer,stock,weight,fineness,images'
  next()
}

exports.getAllProducts = async (req , res) => {
 try{

  //Build the Query 
  // 1A. Filtering
  //The code const queryObj = {...req.query} creates a new object queryObj by copying the properties and values from the req.query object using the object spread syntax.
  const queryObj = {...req.query}
  const excludedFields = ['page' , 'sort' , 'limit' , 'fields'] 
  excludedFields.forEach(el => delete queryObj[el]);

  // 1B. Advanced filtering
  //In regular expressions, The \b is a word boundary anchor. It matches a position between a word character.
  //In regular expressions, the /g flag is known as the "global" flag. When it is used, the regular expression pattern is applied globally, meaning it matches all occurrences of the pattern within the input string, rather than just the first occurrence.
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(/\b(gte|gt|lte|lt|eq)\b/g , match => `$${match}`);

  // console.log(req.query , JSON.parse(queryString));
  let query = Product.find(JSON.parse(queryString));

  // 2. Sorting
  if(req.query.sort) {
    //using comma to separate(split) the element you want to sorted and after join back with join().
    const sortBy = req.query.sort.split(',').join(' ')
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 3. Field limiting
  //select() is a method of Mongoose that is used to select document fields that are to be returned in the query result. 
  //It is used to include or exclude document fields that are returned from a Mongoose query.
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }
  
  // 4. Pagination
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 100 ;
   const skip = (page - 1) * limit;
   query = query.skip(skip).limit(limit);

   if (req.query.page) {
    const numProducts = await Product.countDocuments()
    if (skip >= numProducts) throw new Error('This page does not exist');
  }

  // Execute the Query
  const products = await query

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
  })
}
};