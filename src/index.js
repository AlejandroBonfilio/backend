const express = require('express');
const exphbs = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const messagesRouter = require('./routes/messages');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

app.use(express.json());

// Rutas de productos, carritos y mensajes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main', // Nombre del archivo de diseño principal (layout)
  extname: '.handlebars', // Extensión de los archivos de plantilla
  // Otros ajustes y opciones que desees configurar
}));
app.set('view engine', 'handlebars');

// Establecer conexión a MongoDB
mongoose.connect('mongodb+srv://alejandrobonfilio:8tGhkpQs4xjoONxK@proyectocoder.4rmhp77.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Ruta para la vista de productos en tiempo real
app.get('/realTimeProducts', (req, res) => {
  // Obtener los productos desde la base de datos y renderizar la vista
  // Puedes utilizar el modelo de Product de Mongoose para esto
  Product.find()
    .then((products) => {
      res.render('realTimeProducts', { products });
    })
    .catch((error) => {
      console.error('Error retrieving products:', error);
      res.status(500).send('Internal Server Error');
    });
});


app.set('views', path.join(__dirname, 'views'));

// Maneja la ruta para la vista de chat
app.get('/chat', (req, res) => {
  // Obtiene los mensajes de chat desde la base de datos o cualquier otra fuente
  const messages = [
    { user: 'usuario1@example.com', message: 'Hola' },
    { user: 'usuario2@example.com', message: '¡Hola! ¿Cómo estás?' },
    { user: 'usuario1@example.com', message: 'Bien, gracias' }
  ];

  // Renderiza la vista de chat y pasa los mensajes como datos
  res.render('chat', { messages });
});


// Ruta para la creación de productos a través de HTTP
app.post('/api/products', (req, res) => {
  const newProductData = req.body;

  // Crear un nuevo documento de producto utilizando el modelo de Product de Mongoose
  Product.create(newProductData)
    .then((newProduct) => {
      // Emitir un evento al servidor de WebSockets con los datos del nuevo producto
      io.emit('newProductCreated', newProduct);
      res.status(201).json({ message: 'Product created successfully' });
    })
    .catch((error) => {
      console.error('Error creating product:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Iniciar el servidor HTTP y el servidor de WebSockets
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


