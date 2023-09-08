require('dotenv').config();
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../dao/models/user');
const UserRepository = require('../repositories/userRepository');
const authController = require('../dao/controllers/authController');
const UserDTO = require('../dtos/userDTO');

const mockingProducts = require('../dao/controllers/mockingProducts'); 

// Ruta para obtener productos 
router.get('/mockingproducts', mockingProducts.getMockProducts);


// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para manejar el registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const userDTO = new UserDTO(req.body);
    const user = await UserRepository.create(userDTO);
    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (error) {
    res.status(500).send('Error al registrar al usuario');
  }
});

// Ruta para el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserRepository.findByUsername(username);
    if (!user) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    req.session.userId = user._id;
    res.redirect('/products');
  } catch (error) {
    res.status(500).send('Error al iniciar sesión');
  }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/auth/login');
  });
});

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
      const user = await UserRepository.findById(req.session.userId);
      if (user) {
        const userDTO = new UserDTO(user);
        res.json({ user: userDTO }); // Devolver el usuario en el DTO como respuesta JSON
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario actual' });
  }
});

module.exports = router;
