const Table = require('../models/Table');
const { validationResult } = require('express-validator');

// Get all tables
exports.getTables = async (req, res, next) => {
  try {
    const { available } = req.query;
    const filter = {};

    if (available) {
      filter.isAvailable = available === 'true';
    }

    const tables = await Table.find(filter).sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new table (Admin only)
exports.createTable = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { number, capacity, location } = req.body;

    // Check if table number already exists
    let table = await Table.findOne({ number });
    if (table) {
      return res.status(400).json({ msg: 'Table with this number already exists' });
    }

    table = new Table({
      number,
      capacity,
      location
    });

    await table.save();
    res.status(201).json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update table (Admin only)
exports.updateTable = async (req, res, next) => {
  try {
    const { number, capacity, location, isAvailable } = req.body;

    let table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    // Check if new number is already taken by another table
    if (number && number !== table.number) {
      const existingTable = await Table.findOne({ number });
      if (existingTable) {
        return res.status(400).json({ msg: 'Table with this number already exists' });
      }
    }

    table.number = number || table.number;
    table.capacity = capacity || table.capacity;
    table.location = location || table.location;
    table.isAvailable = isAvailable !== undefined ? isAvailable : table.isAvailable;

    await table.save();
    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete table (Admin only)
exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    // Check if table is currently in use
    const activeOrder = await Order.findOne({ table: table._id, status: { $in: ['pending', 'confirmed', 'preparing', 'ready'] } });
    if (activeOrder) {
      return res.status(400).json({ msg: 'Table is currently in use and cannot be deleted' });
    }

    await table.remove();
    res.json({ msg: 'Table removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};