const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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