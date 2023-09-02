const express = require('express');
const router = express.Router();
const UserRepository = require('../repositories/userRepository');
const UserDTO = require('../dtos/userDTO');

// Ruta para la página de inicio
router.get('/', (req, res) => {
  res.render('login'); // Redirigir al formulario de inicio de sesión
});

// Ruta para el perfil del usuario (requiere autenticación)
router.get('/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/login');
    }

    const user = await UserRepository.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userDTO = new UserDTO(user);
    res.render('profile', { user: userDTO }); // Renderizar la vista de perfil con los datos del usuario en el DTO
  } catch (error) {
    res.status(500).send('Error al obtener el perfil del usuario');
  }
});

module.exports = router;
