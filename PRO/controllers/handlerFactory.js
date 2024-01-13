const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeature');

/**
  * A factory function in JavaScript is a function that produces and returns objects.
  * It is called a "factory" because, like a factory in manufacturing, it creates instances of objects based on a template or a set of specifications.
  * The primary purpose of a factory function is to abstract and encapsulate the process of creating objects, 
  * allowing you to easily create multiple instances with similar properties and behaviors. 
*/


exports.deleteOne = Model => catchAsync(async (req , res , next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID' , 404));
    }

    res.status(204).json({
        status: 'success' ,
        data: null
    });
});

exports.updateOne = Model => catchAsync(async (req , res , next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id , req.body , {
      new: true ,
      //if true, runs update validators on this command. Update validators validate the update operation against the model's schema
      runValidators: true
    });
  
    if (!doc) {
      return next(new AppError('No document found with that ID' , 404));
    };
  
    res.status(200).json({
      requestedAt: req.requestTime,
      status: "success",
      data: {
        data: doc
      },
    });
  });

  exports.createOne = Model => catchAsync(async (req , res , next) => {
    const doc = await Model.create(req.body);
    //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
    res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

exports.getOne = ( Model , populateOptions ) => catchAsync(async (req , res , next) => {

  let query = Model.findById(req.params.id);
  if (populateOptions) query = query.populate(populateOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID' , 404));
  };

  res.status(200).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

exports.getAll = Model => catchAsync(async (req , res , next) => {
  //to allow for nested GET all review on product(small hack)
  let filter = {};
  if(req.params.productId) filter = { products: req.params.productId };

  // Execute the Query
  const features = new APIFeatures(Model.find(filter) , req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query

  //Send response 
  res.status(200).json({
    status : 'success' ,
    result: doc.length ,
    data: {
      data: doc
    }
  });
});