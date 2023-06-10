const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../db/products.json');

const getAllProducts = (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  res.json(products);
};

const getProductById = (req, res) => {
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
};

const createProduct = (req, res) => {
  const newProduct = req.body;
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  products.push(newProduct);
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
  res.json(newProduct);
};

const updateProduct = (req, res) => {
  const productId = req.params.pid;
  const updatedProductData = req.body;
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  const updatedProducts = products.map((product) => {
    if (product.id === productId) {
      return { ...product, ...updatedProductData };
    }
    return product;
  });
  fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  res.json(updatedProductData);
};

const deleteProduct = (req, res) => {
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
  const updatedProducts = products.filter((product) => product.id !== productId);
  fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  res.json({ message: 'Producto eliminado correctamente' });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
