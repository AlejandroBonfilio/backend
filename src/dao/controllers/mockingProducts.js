
// Genera datos de productos de ejemplo
const generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 1; i <= 100; i++) {
      mockProducts.push({
        _id: `product${i}`,
        name: `Product ${i}`,
        description: `Description for Product ${i}`,
        price: Math.random() * 100, // Precio aleatorio entre 0 y 100
        stock: Math.floor(Math.random() * 100), // Stock aleatorio entre 0 y 100
      });
    }
    return mockProducts;
  };
  
  // Define un controlador para el endpoint de mocking de productos
  const getMockProducts = (req, res) => {
    const mockProducts = generateMockProducts();
    res.json(mockProducts);
  };
  
  module.exports = {
    getMockProducts,
  };
  