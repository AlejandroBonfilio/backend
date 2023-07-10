const mongoose = require('mongoose');

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // Agrega otros campos del producto según tus necesidades
});

// Crear el modelo del producto
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
module.exports = Product;
