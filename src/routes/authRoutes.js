const express = require('express');
const router = express.Router();
const User = require('../dao/models/user');
const authController = require('../dao/controllers/authController');

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro de usuarios
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Error al registrar al usuario');
  }
});

// Ruta para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.render('login', { error: 'Usuario no encontrado' });
      }
  
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return res.render('login', { error: 'Error en el servidor' });
        }
        if (!isMatch) {
          return res.render('login', { error: 'Contraseña incorrecta' });
        }
  
        req.session.userId = user._id;
        res.redirect('/products'); // Redirigir al usuario a la vista de productos
      });
    } catch (err) {
      res.status(500).send('Error al iniciar sesión');
    }
  });
  

// Ruta para cerrar sesión
router.post('/logout', authController.logoutUser);

module.exports = router;
