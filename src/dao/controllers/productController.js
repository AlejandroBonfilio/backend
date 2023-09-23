const Product = require('../models/product');
const { requireAdmin, requireUser } = require('../controllers/authorizationMiddleware'); // Importa el middleware de autorización

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await Product.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// controlador para crear un producto
const createProduct = async (req, res) => {
  const { name, description } = req.body;
  const ownerId = req.user.role === 'premium' ? req.user.email : 'admin';

  try {
    const product = new Product({ name, description, owner: ownerId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};


const updateProduct = async (req, res) => {
  // Protege esta ruta con el middleware requireAdmin para permitir solo a los administradores actualizar productos
  requireAdmin(req, res, async () => {
    const productId = req.params.pid;
    const updatedProductData = req.body;
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
};

// Controlador para eliminar un producto
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const userRole = req.user.role;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (userRole === 'admin' || (userRole === 'premium' && product.owner === req.user.email)) {
      await product.remove();
      res.json({ message: 'Producto eliminado exitosamente' });
    } else {
      res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
