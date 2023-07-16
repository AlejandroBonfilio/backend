const Cart = require('../models/cart');

const getCartById = async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.findById(cartId);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

const createCart = async (req, res) => {
  const newCart = {
    id: generateUniqueId(), // Generar un ID único para el carrito
    products: [],
  };
  try {
    const createdCart = await Cart.create(newCart);
    res.status(201).json(createdCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const existingProduct = cart.products.find((p) => p.id === productId);
      if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar la cantidad del producto si ya existe en el carrito
      } else {
        cart.products.push({ id: productId, quantity: 1 }); // Agregar el producto al carrito
      }
      await cart.save();
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir el producto al carrito' });
  }
};

const deleteProductFromCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      cart.products = cart.products.filter((p) => p.id !== productId);
      await cart.save();
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
};

const updateCart = async (req, res) => {
  const cartId = req.params.cid;
  const { products } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      cart.products = products;
      await cart.save();
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

const updateProductQuantity = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const product = cart.products.find((p) => p.id === productId);
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      } else {
        product.quantity = quantity;
        await cart.save();
        res.json(cart.products);
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
};

const deleteCart = async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      cart.products = [];
      await cart.save();
      res.json(cart);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
  }
};

const getCartProducts = async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.render('cart', { cart });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteCart,
  getCartProducts,
};