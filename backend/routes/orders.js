const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const ordersController = require('../controllers/orderController');

const router = express.Router();

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

router.get('/', auth, ordersController.getOrders);
router.get('/:id', auth, ordersController.getOrder);
router.put('/:id/status', auth, ordersController.updateOrderStatus);

module.exports = router;