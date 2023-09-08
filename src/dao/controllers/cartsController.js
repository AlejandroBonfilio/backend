const Cart = require('../models/cart');
const Ticket = require('../../ticket');
const Product = require('../models/product');
const errorMessages = require('../models/errorMessages'); // Importa tus mensajes de error
const createError = require('../controllers/messagesController');

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

const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;
try {
  // Encontrar el carrito por su ID
  const cart = await Cart.findById(cartId);
  if (!cart) {
    // Utiliza el customizador de errores para crear un error personalizado
    const error = createError(errorMessages.cartNotFound, 404);
    throw error; // Lanza el error
  }

  // Verificar el stock de los productos en el carrito
  for (const productItem of cart.products) {
    const product = await Product.findById(productItem.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si hay suficiente stock
    if (product.stock < productItem.quantity) {
      return res.status(400).json({ error: 'No hay suficiente stock para un producto en el carrito' });
    }

    // Restar la cantidad del producto del stock
    product.stock -= productItem.quantity;
    await product.save();
  }

  // Calcular el monto total del carrito
  const calculateTotalAmount = async (cart) => {
    try {
      const productIds = cart.products.map((productItem) => productItem.id);
      
      // Realizar consultas de búsqueda de productos de forma asíncrona
      const productPromises = productIds.map(async (productId) => {
        const product = await Product.findById(productId);
        return product;
      });
  
      // Esperar a que todas las consultas se resuelvan
      const products = await Promise.all(productPromises);
  
      // Calcular el monto total
      const totalAmount = products.reduce((total, product, index) => {
        return total + product.price * cart.products[index].quantity;
      }, 0);
  
      return totalAmount;
    } catch (error) {
      throw new Error('Error al calcular el monto total del carrito');
    }
  };

  // Crear un nuevo ticket de compra
  const ticket = new Ticket({
    code: generateUniqueCode(), // Implementa una función para generar un código único
    purchase_datetime: new Date(),
    amount: totalAmount,
    purchaser: req.user.email, // O el campo correcto que identifica al usuario
  });

  // Guardar el ticket en la base de datos
  await ticket.save();

  // Limpiar el carrito (eliminar todos los productos)
  cart.products = [];
  await cart.save();

  res.status(200).json({ message: 'Compra exitosa' });
} catch (error) {
  res.status(500).json({ error: 'Error al realizar la compra' });
}
};





const addProductToCart = async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
       // Utiliza el customizador de errores para crear un error personalizado
       const error = createError(errorMessages.cartNotFound, 404);
       throw error; // Lanza el error
    } else {
      const existingProduct = cart.products.find((p) => p.id === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
        // Utiliza el customizador de errores para crear un error personalizado
      const error = createError(errorMessages.productAlreadyInCart, 400);
      throw error; // Lanza el error // Incrementar la cantidad del producto si ya existe en el carrito
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
  purchaseCart,
};