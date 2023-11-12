const Product = require('../models/product');
const User = require('../models/user');
const Purchase = require('../models/purchase');
const nodemailer = require('nodemailer'); // Para enviar correos electrónicos

// Obtener lista de productos disponibles
async function getProductList(req, res) {
  try {
    const products = await Product.find({ available: true });
    res.render('product-list', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la lista de productos');
  }
}

// Obtener detalles de un producto específico
async function getProductDetails(req, res) {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.render('product-details', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los detalles del producto');
  }
}

// Obtener el carrito de compras del usuario
async function getCart(req, res) {
  const userId = req.user.id; 
  try {
    const user = await User.findById(userId).populate('cart');
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.render('cart', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el carrito de compras');
  }
}

// Iniciar el proceso de pago
async function getCheckout(req, res) {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate('cart');
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

   
    sendPurchaseConfirmationEmail(user.email);

    res.render('checkout', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar el pago');
  }
}

// Mostrar historial de compras del usuario
async function getOrderHistory(req, res) {
  const userId = req.user.id; 
  try {
    const purchases = await Purchase.find({ user: userId });
    res.render('order-history', { purchases });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el historial de compras');
  }
}

// Mostrar perfil del usuario
async function getUserProfile(req, res) {
  const userId = req.user.id; 
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.render('user-profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el perfil de usuario');
  }
}

// Función para enviar un correo electrónico de confirmación de compra
function sendPurchaseConfirmationEmail(userEmail) {
  const transporter = nodemailer.createTransport({
    
  });

  const mailOptions = {
    from: 'tuapp@example.com',
    to: userEmail,
    subject: 'Confirmación de compra',
    text: '¡Gracias por tu compra! Tu pedido ha sido confirmado.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico', error);
    } else {
      console.log('Correo electrónico de confirmación enviado', info.response);
    }
  });
}

module.exports = {
  getProductList,
  getProductDetails,
  getCart,
  getCheckout,
  getOrderHistory,
  getUserProfile,
};
