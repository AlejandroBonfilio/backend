const User = require('../models/user');
const errorMessages = require('../models/errorMessages'); 

const toggleUserRole = async (req, res) => {
  const userId = req.params.uid;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      // Verificar si el usuario tiene permiso para cambiar el rol (por ejemplo, si es un administrador)
      if (req.user.role !== 'admin') {
        res.status(403).json({ error: 'No tienes permiso para cambiar el rol de este usuario' });
      } else {
        // Cambiar el rol del usuario (de user a premium o viceversa)
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();
        res.json({ message: 'Rol de usuario actualizado con éxito' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
  }
};

module.exports = {
  toggleUserRole,
};
