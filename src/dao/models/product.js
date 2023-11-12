const mongoose = require('mongoose');

// esquema del producto

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  owner: {
    type: String, 
    required: function () {
      return this.owner || this.owner === 'admin';
    },
  },
  
 
});

// Crear el modelo del producto
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
module.exports = Product;
