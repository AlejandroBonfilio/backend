const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const manager = new ProductManager();
manager.loadProductsFromFile();

app.get('/products', (req, res) => {
  const products = manager.getProducts();
  const limit = parseInt(req.query.limit);
  if (!isNaN(limit) && limit > 0) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = manager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
