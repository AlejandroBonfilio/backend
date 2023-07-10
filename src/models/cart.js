const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // Definir los campos del esquema del carrito
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  // Otros campos del carrito, si los necesitas
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
