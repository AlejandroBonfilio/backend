
function requireAdmin(req, res, next) {
    if (req.session && req.session.userRole === 'admin') {
      return next(); // Permite el acceso si el usuario es administrador
    } else {
      return res.status(403).json({ message: 'Acceso denegado' }); // Deniega el acceso si no es administrador
    }
  }
  
  function requireUser(req, res, next) {
    if (req.session && req.session.userRole === 'user') {
      return next(); // Permite el acceso si el usuario es un usuario común
    } else {
      return res.status(403).json({ message: 'Acceso denegado' }); // Deniega el acceso si no es un usuario común
    }
  }
  
  module.exports = {
    requireAdmin,
    requireUser,
  };
  