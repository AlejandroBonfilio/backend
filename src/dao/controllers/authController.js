const User = require('../models/user');

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (err) {
    res.status(500).send('Error al registrar al usuario');
  }
};

const getUserData = async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (err) {
      console.error('Error al obtener datos del usuario:', err);
      return null;
    }
  };

  const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.render('login', { error: 'Usuario no encontrado' });
      }
  
      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          return res.render('login', { error: 'Error en el servidor' });
        }
        if (!isMatch) {
          return res.render('login', { error: 'Contraseña incorrecta' });
        }
  
        // Establecer el rol del usuario en función del nombre de usuario
        user.role = username === 'adminCoder@coder.com' ? 'admin' : 'usuario';
  
        req.session.userId = user._id;
        res.redirect('/products');
      });
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
