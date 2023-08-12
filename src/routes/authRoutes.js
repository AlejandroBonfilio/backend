const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../dao/controllers/authController');
const User = require('../dao/models/user');

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro de usuarios
router.post('/register', authController.registerUser);

// Ruta para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', authController.loginUser);

// Ruta para cerrar sesión
router.post('/logout', authController.logoutUser);

// Ruta para autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback para autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/products',
  failureRedirect: '/auth/login',
}));

// Ruta para obtener el usuario actual
router.get('/current', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId); // Buscar el usuario por su ID de sesión
      if (user) {
        res.json({ user }); // Devolver el usuario en la respuesta JSON
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el usuario actual' });
  }
});

module.exports = router;
