// Enrutador para la gestión de compras
const express = require('express');
const router = express.Router();
const purchaseController = require('../dao/controllers/purchaseController'); 

// Rutas para compras
router.get('/products', purchaseController.getProductList);
router.get('/products/:id', purchaseController.getProductDetails);
router.get('/cart', purchaseController.getCart);
router.get('/checkout', purchaseController.getCheckout);
router.get('/order-history', purchaseController.getOrderHistory);
router.get('/user-profile', purchaseController.getUserProfile);

module.exports = router;
