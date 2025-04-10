const express = require('express');
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Example admin route
router.get('/stats', auth, adminController.getDashboardStats);

module.exports = router;
