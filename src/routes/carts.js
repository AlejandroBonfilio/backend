const express = require('express');
const cartController = require('../controllers/cartsController');

const router = express.Router();

router.get('/:cid', cartController.getCartById);
router.post('/', cartController.createCart);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;
