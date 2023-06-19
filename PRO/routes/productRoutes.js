const express = require('express');
const productController = require('./../controllers/productController');

const router = express.Router();

// Define routes
router
.route('/')
.get(productController.getAllProducts)
.post(productController.createProduct);

router
.route('/:id')
.get(productController.getProduct)
.patch(productController.updateProduct)
.delete(productController.deleteProduct);

// Creating routes for gold and silver products
router.route('/gold-product').get(productController.aliasGoldProduct , productController.getAllProducts);
router.route('/silver-product').get(productController.aliasSilverProduct , productController.getAllProducts);
module.exports = router;