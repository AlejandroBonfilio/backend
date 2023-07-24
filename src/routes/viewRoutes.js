const express = require('express');
const router = express.Router();

// Ruta para la página de inicio
router.get('/', (req, res) => {
  res.render('login'); // Redirigir al formulario de inicio de sesión
});

// Ruta para el perfil del usuario (requiere autenticación)
router.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  // Obtener el usuario actual desde la base de datos y pasar sus datos a la vista
  // const user = ...; // Implementar la lógica para obtener el usuario actual
  res.render('profile', { user }); // Renderizar la vista de perfil con los datos del usuario
});

module.exports = router;
