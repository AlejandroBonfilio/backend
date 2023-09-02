require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../../config');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const UserRepository = require('../../repositories/userRepository');
const UserDTO = require('../../dtos/userDTO');

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Error al registrar al usuario');
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    req.session.userId = user._id;
    res.redirect('/products'); // Redirigir al usuario a la vista de productos
  } catch (err) {
    res.status(500).send('Error al iniciar sesión');
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/auth/login');
  });
};

// Resto del código de configuración de Passport...

// Rutas de autenticación de GitHub...
// ...

router.post('/register', passport.authenticate('register', {
  successRedirect: '/profile',
  failureRedirect: '/auth/register',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('login', {
  successRedirect: '/products',
  failureRedirect: '/auth/login',
  failureFlash: true,
}));

// Middleware para inicializar Passport...
// ...

// Ruta para obtener el usuario actual
router.get('/current', async (req, res) => {
  try {
    if (req.session.userId) {
      const user = await UserRepository.findById(req.session.userId);
      if (user) {
        const userDTO = new UserDTO(user.id, user.username, user.email); // Asegurarse de tener los campos necesarios
        res.json({ user: userDTO });
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  router,
};
