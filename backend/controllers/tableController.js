const Table = require('../models/Table');

// Get all tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    const newTable = new Table({
      number,
      capacity,
    });

    const table = await newTable.save();
    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { number, capacity },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    res.json(table);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    res.json({ msg: 'Table deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};