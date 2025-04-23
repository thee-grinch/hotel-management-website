const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');
const dotenv = require('dotenv');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from this origin
  origin: 'https://silver-halibut-wjjgg97jrwjc9pj7-5173.app.github.dev',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
  optionsSuccessStatus: 200
};
// Apply CORS middleware globally
app.use(helmet({
  crossOriginResourcePolicy: false // Disable Helmet's CORP policy
}));

app.use(cors(corsOptions));

// Middleware
app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}, Method: ${req.method}`);
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with CORS enabled
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(auth); // Use the auth middleware for all routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/reservations', require('./routes/reservations'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;