const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Base de datos simulada (debes reemplazarla con tu propia base de datos)
const users = [];

// Inicializar Express y middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Inicializar Nodemailer para el envío de correos electrónicos
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'tu_correo@gmail.com', 
    pass: 'tu_contraseña' 
  }
});

// Ruta para solicitar recuperación de contraseña
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Verifica si el usuario existe en la base de datos (debes implementar tu propia lógica aquí)
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Genera un token único para el usuario
  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

  // Envía un correo electrónico con el enlace de recuperación
  const resetLink = `http://tuapp.com/reset-password/${token}`;
  const mailOptions = {
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    } else {
      return res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
    }
  });
});

// Ruta para restablecer la contraseña
app.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Busca al usuario por el token de restablecimiento
  const user = users.find(u => u.resetPasswordToken === token);

  if (!user) {
    return res.status(400).json({ error: 'Token no válido' });
  }

  // Verifica si el token ha expirado
  if (Date.now() > user.resetPasswordExpires) {
    return res.status(400).json({ error: 'El token ha expirado' });
  }

  // Actualiza la contraseña del usuario y elimina el token de restablecimiento
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
