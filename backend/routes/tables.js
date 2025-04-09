const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const tableController = require('../controllers/tableController');

// @route   GET api/tables
// @desc    Get all tables
// @access  Public
router.get('/', tableController.getTables);

// @route   POST api/tables
// @desc    Create table
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    [
      check('number', 'Table number is required').not().isEmpty(),
      check('capacity', 'Capacity is required').isInt({ min: 1 })
    ]
  ],
  tableController.createTable
);

// @route   PUT api/tables/:id
// @desc    Update table
// @access  Private/Admin
router.put('/:id', auth, tableController.updateTable);

// @route   DELETE api/tables/:id
// @desc    Delete table
// @access  Private/Admin
router.delete('/:id', auth, tableController.deleteTable);

module.exports = router;