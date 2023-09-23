const express = require('express');
const cartController = require('../dao/controllers/cartsController');
const userController = require('../dao/controllers/userController')

const router = express.Router();

router.get('/:cid', cartController.getCartById);
router.post('/', cartController.createCart);
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid', cartController.deleteCart);
router.post('/:cid/purchase', cartController.purchaseCart);
router.put('/api/users/premium/:uid', userController.toggleUserRole);

module.exports = router;
