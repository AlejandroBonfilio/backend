
const express = require('express');
const multer = require('multer');
const userController = require('../controllers/userController');
const documentUploadMiddleware = require('../middlewares/documentUpload');

const router = express.Router();

// Ruta para cargar documentos
router.post('/:uid/documents', multer().single('document'), documentUploadMiddleware, userController.uploadDocuments);

// Ruta para actualizar a un usuario a premium
router.put('/premium/:uid', userController.updateToPremium);

module.exports = router;
