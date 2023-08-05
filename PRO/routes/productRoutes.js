const express = require('express');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Creating routes for gold and silver products
router.route('/gold-product')
.get(productController.aliasGoldProduct , productController.getAllProducts);

router.route('/silver-product')
.get(productController.aliasSilverProduct , productController.getAllProducts);

//Creating routes for products stats
router.route('/products-stats').get(productController.getProductsStats);

//Creating routes for product to see next stock
router.route('/next-stock/:year').get(productController.getNextStock);


// Define routes
router
.route('/')
.get(authController.protect , productController.getAllProducts)
.post(productController.createProduct);

router
.route('/:id')
.get(productController.getProduct)
.patch(productController.updateProduct)
.delete(authController.protect , authController.restrictTo('admin' , 'supervisor') , productController.deleteProduct);

module.exports = router;