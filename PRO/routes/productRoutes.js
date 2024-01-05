const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

/*
  * POST /products/234fad4/reviews -> it's example
  * GET  /products/234fad4/reviews -> it's example
  * GET  /products/234fad4/reviews/94887fda -> it's example
   // router
   // .route('/:productId/reviews')
   // .post(authController.protect , authController.restrictTo('user') , reviewController.createReview);
   * this section is merged ( mergeParams: true ) with review routes to se the review from products (nested routes)
   * ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
*/

router.use('/:productId/reviews' , reviewRouter);

// Creating routes for gold and silver products
router.route('/gold-product')
.get(productController.aliasGoldProduct , productController.getAllProducts);

router.route('/silver-product')
.get(productController.aliasSilverProduct , productController.getAllProducts);

//Creating routes for products stats
router.route('/products-stats')
.get(productController.getProductsStats);

//Creating routes for product to see next stock
router.route('/next-stock/:year')
.get(authController.protect , authController.restrictTo('admin' , 'supervizor' , 'seller') , productController.getNextStock);
 

// Define routes
router
.route('/')
.get(productController.getAllProducts)
.post(authController.protect , authController.restrictTo('admin' , 'supervizor' , 'seller' ), productController.createProduct);

router
.route('/:id')
.get(productController.getProduct)
.patch(authController.protect , authController.restrictTo('admin' , 'supervisor'), productController.updateProduct)
.delete(authController.protect , authController.restrictTo('admin' , 'supervisor') , productController.deleteProduct);

module.exports = router;