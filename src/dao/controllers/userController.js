const User = require('../models/user');
const errorMessages = require('../models/errorMessages'); 

const toggleUserRole = async (req, res) => {
  const userId = req.params.uid;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      // Verificar si el usuario tiene permiso para cambiar el rol 
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


const userController = {
  uploadDocuments: async (req, res) => {
    const { uid } = req.params;
    const { file } = req;

    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Agregar el documento al array de documentos del usuario
      user.documents.push({ name: file.originalname, reference: file.path });
      await user.save();

      res.status(200).json({ message: 'Documento cargado con éxito' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateToPremium: async (req, res) => {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si el usuario ha cargado los documentos necesarios
      const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
      const userDocuments = user.documents.map(doc => doc.name);

      if (requiredDocuments.every(doc => userDocuments.includes(doc))) {
        // Actualizar al usuario a premium
        user.role = 'premium';
        await user.save();
        res.status(200).json({ message: 'Usuario actualizado a premium' });
      } else {
        res.status(400).json({ error: 'Usuario no ha subido todos los documentos requeridos' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

// Función para obtener todos los usuarios
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, 'first_name last_name email role'); // Define los campos que deseas devolver
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

// Función para eliminar usuarios inactivos
async function deleteInactiveUsers(req, res) {
  try {
    // Calcula la fecha límite (por ejemplo, 2 días atrás)
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 2);

    // Elimina usuarios que no han tenido conexión desde limitDate
    const result = await User.deleteMany({ last_connection: { $lt: limitDate } });
    
  

    res.status(200).json({ message: 'Usuarios inactivos eliminados' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuarios inactivos' });
  }
}

// Función para mostrar la vista de administrador
function showAdminView(req, res) {
  // Asegúrate de verificar si el usuario actual es un administrador antes de mostrar la vista
  if (req.user && req.user.role === 'admin') {
    // Renderiza la vista HTML o utiliza el motor de vistas que prefieras
    res.render('admin-view'); 
  } else {
    res.status(403).json({ message: 'Acceso no autorizado' });
  }
}

module.exports = {
  toggleUserRole,
  userController,
  getAllUsers,
  deleteInactiveUsers,
  showAdminView,
  

};
