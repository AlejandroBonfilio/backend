require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('../../config');

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');




const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Hashear la contraseña utilizando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario con la contraseña hasheada
    const user = await User.create({ username, password: hashedPassword });

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
  
      // Comparar la contraseña hasheada almacenada con la contraseña proporcionada
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

// Configuración de passport para el registro
passport.use('register', new LocalStrategy({
  passReqToCallback: true,
}, async (req, username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (user) {
      return done(null, false, { message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

// Configuración de passport para el inicio de sesión
passport.use('login', new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serializar el usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar el usuario
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


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


// Configurar la estrategia de autenticación de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID:config.githubClientID,
      clientSecret:config.githubClientSecret,
      callbackURL:'http://localhost:8080/api/session/githubcallback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Implementar la lógica para manejar la autenticación con GitHub aquí
      done(null, profile);
    }
  )
);


// Middleware para inicializar Passport
passport.initialize();

// Rutas de autenticación de GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // El usuario ha sido autenticado con éxito
    // Puedes acceder a los datos del usuario a través de req.user
    res.redirect('/products'); // Redirigir al usuario a la vista de productos o a la página que desees
  }
);







module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  router,
};
