const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./middleware/auth');

const app = express();
// app.options('*', cors()); // Enable CORS for preflight requests
const corsOptions = {
    origin: 'https://silver-halibut-wjjgg97jrwjc9pj7-5173.app.github.dev', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

// Middleware
app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}, Method: ${req.method}`);
    next();
});

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// Add these after your existing route imports
app.use('/api/auth', require('./routes/auth'));
app.use(auth); // Use the auth middleware for all routes
app.use('/api/users', require('./routes/user'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/reservations', require('./routes/reservations'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;