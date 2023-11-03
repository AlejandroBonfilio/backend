const multer = require('multer');

// Configuración de Multer para guardar documentos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, 'uploads/documents'); 
  },
  filename: (req, file, cb) => {
    // Define el nombre del archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const documentUploadMiddleware = multer({ storage });

module.exports = documentUploadMiddleware;