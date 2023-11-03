
const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../dao/controllers/userController');
const documentUploadMiddleware = require('../dao/middlewares/documentUploadMiddleware');


// Ruta para cargar documentos
router.post('/:uid/documents', documentUploadMiddleware, (req, res) => {
    userController.uploadDocuments(req, res);
});



// Ruta para actualizar a un usuario a premium
router.put('/premium/:uid', userController.updateToPremium);

router.get('/', userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', userController.deleteInactiveUsers);

// Ruta para mostrar la vista de administrador (protegida por autenticación de administrador)
router.get('/admin', userController.showAdminView);


module.exports = router;
