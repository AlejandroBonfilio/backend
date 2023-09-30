const express = require('express');
require('dotenv').config();
const app = express();
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const exphbs = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const messagesRouter = require('./routes/messages');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const querystring = require('querystring');
const path = require('path');
const cartsController = require('./dao/controllers/cartsController');
const passport = require('passport');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Ticket = require('./ticket'); 

const session = require('express-session');
const MongoStore = require('connect-mongo');

require('./dao/controllers/password-reset');


const routes = require('./routes/authRoutes');

mongoose.connect('mongodb+srv://alejandrobonfilio:8tGhkpQs4xjoONxK@proyectocoder.4rmhp77.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const winston = require('winston');
const getLogger = require('./logger');


// Define la configuración de Swagger
const swaggerDefinition = {
  info: {
    title: 'Nombre de tu API',
    version: '1.0.0',
    description: 'Descripción de tu API',
  },
  basePath: '/', // Ruta base de tu API
};

const options = {
  swaggerDefinition,
  apis: ['./routes/products.js'], 
  apis: ['./routes/carts.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

// Agrega la documentación Swagger a tu aplicación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Importa tus controladores y estrategias de Passport
const {
  registerUser,
  loginUser,
  logoutUser,
  router,
} = require('./dao/controllers/authController');


const server = http.createServer(app);
const io = socketIO(server);

const PORT = 8080;

app.use('/api', routes);




// Configura express-session
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://alejandrobonfilio:8tGhkpQs4xjoONxK@proyectocoder.4rmhp77.mongodb.net/?retryWrites=true&w=majority' })
}));

// Configura Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://alejandrobonfilio:8tGhkpQs4xjoONxK@proyectocoder.4rmhp77.mongodb.net/?retryWrites=true&w=majority' })
}));



winston.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Para guardar errores en un archivo
  ],
});

app.get('/loggerTest', (req, res) => {
  // Ejemplo de uso del logger
  winston.error('Este es un mensaje de error');
  res.send('Hola soy el logger');
 
});



// Importar las rutas de carritos y usarlas en la aplicación
const cartRoutes = require('./routes/carts');
app.use('/carts', cartRoutes);



// Rutas de productos, carritos y mensajes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);

app.post('/api/carts/add', cartsController.addProductToCart);

app.get('/carts/:cid', cartsController.getCartProducts);

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main', // Nombre del archivo de diseño principal (layout)
  extname: '.handlebars', // Extensión de los archivos de plantilla
  // Otros ajustes y opciones que desees configurar
}));
app.set('view engine', 'handlebars');





app.post('/forgot-password', (req, res) => {
  // ...
});

app.post('/reset-password/:token', (req, res) => {
  // ...
});


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


// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
}));


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


// Importar modelos y rutas
const User = require('./dao/models/user');
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');

// Rutas públicas
app.use('/auth', authRoutes);
app.use('/', viewRoutes);

// Middleware de autenticación para proteger rutas
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/auth/login');
};

// Ruta protegida que requiere autenticación
app.get('/profile', requireAuth, (req, res) => {
  // Obtener el usuario actual desde la base de datos y pasar sus datos a la vista
  // const user = ...; // Implementar la lógica para obtener el usuario actual
  res.render('profile', { user }); // Renderizar la vista de perfil con los datos del usuario
});


// Controlador o archivo de manejo de rutas de productos
app.get('/api/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query, category, availability } = req.query;

  // Convertir los valores de los parámetros a su tipo correspondiente
  const limitValue = parseInt(limit, 10);
  const pageValue = parseInt(page, 10);

  try {
    let productsQuery = Product.find();

    // Aplicar el filtro si se proporciona un query
    if (query) {
      productsQuery = productsQuery.find({ title: query });
    }

    // Aplicar el filtro por categoría si se proporciona
    if (category) {
      productsQuery = productsQuery.find({ category });
    }

    // Aplicar el filtro por disponibilidad si se proporciona
    if (availability) {
      const available = availability.toLowerCase() === 'true';
      productsQuery = productsQuery.find({ available });
    }

    // Aplicar el ordenamiento si se proporciona sort
    if (sort) {
      const sortOrder = sort === 'asc' ? 1 : -1;
      productsQuery = productsQuery.sort({ price: sortOrder });
    }

    // Aplicar la paginación utilizando limit y page
    const startIndex = (pageValue - 1) * limitValue;
    const endIndex = pageValue * limitValue;
    const totalCount = await Product.countDocuments();

    productsQuery = productsQuery.skip(startIndex).limit(limitValue);

    const products = await productsQuery;

    // Construir el objeto de respuesta que incluye los productos y metadatos de paginación
    const totalPages = Math.ceil(totalCount / limitValue);
    const prevPage = pageValue > 1 ? pageValue - 1 : null;
    const nextPage = pageValue < totalPages ? pageValue + 1 : null;
    const hasPrevPage = prevPage !== null;
    const hasNextPage = nextPage !== null;
    const prevLink = hasPrevPage ? buildPageLink(req, prevPage) : null;
    const nextLink = hasNextPage ? buildPageLink(req, nextPage) : null;

    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: pageValue,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
  }
});

// Construir el enlace directo a la página utilizando los query params
const buildPageLink = (req, page) => {
  const query = { ...req.query, page };
  const queryString = querystring.stringify(query);
  const baseUrl = req.baseUrl;
  const pageLink = `${baseUrl}?${queryString}`;
  return pageLink;
};

app.get('/products', (req, res) => {
  // Obtener los productos desde la base de datos o cualquier otra fuente
  const products = [
    { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', price: 10.99, category: 'Categoría 1' },
    { id: 2, name: 'Producto 2', description: 'Descripción del producto 2', price: 19.99, category: 'Categoría 2' },
    { id: 3, name: 'Producto 3', description: 'Descripción del producto 3', price: 15.99, category: 'Categoría 1' },
    // Agregar más productos aquí
  ];

  // Renderizar la vista de productos y pasar los productos como datos
  res.render('products', { products });
});




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

app.set('views', path.join(__dirname, 'views'));

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
