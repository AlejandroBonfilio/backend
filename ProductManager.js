class ProductManager {
    constructor() {
      this.products = [];
      this.nextId = 1;
    }
  
    addProduct(product) {
      if (!this.validateProduct(product)) {
        console.log("No se pudo agregar el producto. Faltan campos obligatorios o el código está duplicado.");
        return;
      }
  
      product.id = this.nextId;
      this.nextId++;
      this.products.push(product);
      console.log("Producto agregado correctamente.");
    }
  
    removeProduct(productId) {
      this.products = this.products.filter((product) => product.id !== productId);
    }
  
    getProductById(productId) {
      const product = this.products.find((product) => product.id === productId);
      if (!product) {
        console.log("Error: Producto no encontrado.");
      }
      return product;
    }
  
    getProducts() {
      return this.products;
    }
  
    validateProduct(product) {
      const { title, description, price, thumbnail, code, stock } = product;
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        return false;
      }
  
      const isDuplicateCode = this.products.some((p) => p.code === code);
      if (isDuplicateCode) {
        return false;
      }
  
      return true;
    }
  }
  
  class Product {
    constructor(title, description, price, thumbnail, code, stock) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.code = code;
      this.stock = stock;
      this.id = null;
    }
  }
  
  // Crear una instancia de ProductManager
  const manager = new ProductManager();
  
  // Agregar productos
  const product1 = new Product(
    "Teclado",
    "Mecanico",
    10000,
    "img1.jpg",
    "101",
    16
  );
  const product2 = new Product(
    "Mouse",
    "Razer 1500dpi",
    20000,
    "img2.jpg",
    "102",
    15
  );
  manager.addProduct(product1);
  manager.addProduct(product2);
  
  // Obtener un producto por su ID y mostrarlo en la consola
  const product = manager.getProductById(1);
  console.log(product);
  
  // Intentar obtener un producto con un ID no existente
  const nonExistentProduct = manager.getProductById(3);
  
  // Obtener todos los productos y mostrarlos en la consola
  const allProducts = manager.getProducts();
  console.log(allProducts);