const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log('No se pudo agregar el producto. Faltan campos obligatorios.');
      return;
    }

    const isDuplicateCode = this.products.some((product) => product.code === code);
    if (isDuplicateCode) {
      console.log('No se pudo agregar el producto. El código está duplicado.');
      return;
    }

    const product = {
      id: this.nextId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(product);
    this.nextId++;
    console.log('Producto agregado correctamente.');

    // Guardar los productos en un archivo después de agregar uno nuevo
    this.saveProductsToFile();
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      console.log('Error: Producto no encontrado.');
      return;
    }

    this.products.splice(productIndex, 1);
    console.log('Producto eliminado correctamente.');

    // Guardar los productos en un archivo después de eliminar uno
    this.saveProductsToFile();
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);
    if (!product) {
      console.log('Error: Producto no encontrado.');
    }
    return product;
  }

  getProducts() {
    return this.products;
  }

  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) {
      console.log('Error: Producto no encontrado.');
      return;
    }

    const product = this.products[productIndex];
    this.products[productIndex] = { ...product, ...updatedFields };
    console.log('Producto actualizado correctamente.');

    // Guardar los productos en un archivo después de actualizar uno
    this.saveProductsToFile();
  }

  saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFile('products.json', data, (err) => {
      if (err) {
        console.error('Error al guardar los productos en el archivo:', err);
      } else {
        console.log('Productos guardados correctamente en el archivo.');
      }
    });
  }

  loadProductsFromFile() {
    fs.readFile('products.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error al cargar los productos desde el archivo:', err);
      } else {
        try {
          const products = JSON.parse(data);
          this.products = products;
          this.nextId = this.getNextId(products);
          console.log('Productos cargados correctamente desde el archivo.');
        } catch (error) {
          console.error('Error al parsear los datos del archivo JSON:', error);
        }
      }
    });
  }

  getNextId(products) {
    let maxId = 0;
    for (const product of products) {
      if (product.id > maxId) {
        maxId = product.id;
      }
    }
    return maxId + 1;
  }
}

module.exports = ProductManager;