const express = require('express');
const exphbs = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main', // Nombre del archivo de diseño principal (layout)
  extname: '.handlebars', // Extensión de los archivos de plantilla
  // Otros ajustes y opciones que desees configurar
}));
app.set('view engine', 'handlebars');


app.set('views', path.join(__dirname, 'views'));

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const products = getProductsFromDatabase();
  res.render('realTimeProducts', { products });
});

// Ruta para la creación de productos a través de HTTP
app.post('/api/products', (req, res) => {
  const newProductData = req.body;

  // Guardar los datos del nuevo producto en la base de datos o en el archivo JSON
  const products = getProductsFromDatabase();
  const newProduct = {
    id: generateProductId(),
    ...newProductData
  };
  products.push(newProduct);
  saveProductsToDatabase(products);

  // Emitir un evento al servidor de WebSockets con los datos del nuevo producto
  io.emit('newProductCreated', newProduct);

  res.status(201).json({ message: 'Product created successfully' });
});

// Iniciar el servidor HTTP y el servidor de WebSockets
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Funciones auxiliares
const dbFolderPath = path.resolve(__dirname, 'db');

function getProductsFromDatabase() {
  const productsData = fs.readFileSync(path.join(dbFolderPath, 'products.json'));
  return JSON.parse(productsData);
}

function saveProductsToDatabase(products) {
  const productsData = JSON.stringify(products, null, 2);
  fs.writeFileSync(path.join(dbFolderPath, 'products.json'), productsData);
}

function generateProductId() {
  // Generar un ID único para el producto (puedes usar una biblioteca como uuid para esto)
  // Aquí se muestra un ejemplo simple
  return Math.floor(Math.random() * 1000);
}
