const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const { validationResult } = require('express-validator');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, orderType, tableId } = req.body;
    const userId = req.user.id;

    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ msg: `Menu item ${item.menuItem} not available` });
      }

      totalAmount += menuItem.price * item.quantity;

      orderItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || '',
        priceAtOrder: menuItem.price
      });
    }

    // Handle table reservation for dine-in orders
    let table = null;
    if (orderType === 'dine-in' && tableId) {
      table = await Table.findById(tableId);
      if (!table || !table.isAvailable) {
        return res.status(400).json({ msg: 'Table not available' });
      }

      // Reserve the table
      table.isAvailable = false;
      await table.save();
    }

    // Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      orderType,
      table: orderType === 'dine-in' ? tableId : null,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all orders (Admin/Staff)
exports.getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    // Admins can see all orders, staff can see non-customer-specific orders
    if (req.user.role === 'customer') {
      filter.user = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('table', 'number capacity')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get order by ID
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('table', 'number capacity')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Customers can only see their own orders
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update order status (Admin/Staff)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status transition' });
    }

    order.status = status;
    order.updatedAt = Date.now();

    // If order is cancelled or delivered, release the table
    if ((status === 'cancelled' || status === 'delivered') && order.table) {
      const table = await Table.findById(order.table);
      if (table) {
        table.isAvailable = true;
        await table.save();
      }
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};