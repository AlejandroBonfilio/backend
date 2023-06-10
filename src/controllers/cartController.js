const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '../db/carts.json');

const getCartById = (req, res) => {
  const cartId = req.params.cid;
  const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf8'));
  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
};

const createCart = (req, res) => {
  const newCart = {
    id: generateUniqueId(), // Generar un ID único para el carrito
    products: [],
  };
  const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf8'));
  carts.push(newCart);
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
  res.json(newCart);
};

const addProductToCart = (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf8'));
  const cart = carts.find((c) => c.id === cartId);
  if (!cart) {
    res.status(404).json({ error: 'Carrito no encontrado' });
  } else {
    const existingProduct = cart.products.find((p) => p.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrementar la cantidad del producto si ya existe en el carrito
    } else {
      cart.products.push({ id: productId, quantity: 1 }); // Agregar el producto al carrito
    }
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
    res.json(cart.products);
  }
};

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
};
