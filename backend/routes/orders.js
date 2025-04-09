const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const ordersController = require('../controllers/orderController');

// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('items', 'Items are required').isArray({ min: 1 }),
      check('orderType', 'Order type is required').isIn(['dine-in', 'takeaway'])
    ]
  ],
  ordersController.createOrder
);

// @route   GET api/orders
// @desc    Get all orders
// @access  Private
router.get('/', auth, ordersController.getOrders);

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, ordersController.getOrder);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, ordersController.updateOrderStatus);

module.exports = router;