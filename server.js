const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Inicializa el puerto
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para permisos en el navegador
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servidor corriendo',
    timestamp: new Date().toISOString()
  });
});

// Ruta de api
app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API funcionando',
    endpoints: ['POST api/login', 'POST api/registro', 'POST api/login/google']
  });
});

// Cargar rutas
const authRoute = require('./routes/auth');
const loginRoute = require('./routes/login');
const passwordRoute = require('./routes/password');
const productosRoute = require('./routes/productos');
const suscripcionRoute = require('./routes/suscripcion');

app.use('/api', authRoute);
app.use('/api', loginRoute);
app.use('/api', passwordRoute);
app.use('/api', productosRoute);
app.use('/api', suscripcionRoute);


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});
