const express = require('express');
const productController = require('../dao/controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
