const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const tableController = require('../controllers/tableController');

const router = express.Router();

router.get('/', tableController.getTables);

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

router.put('/:id', auth, tableController.updateTable);
router.delete('/:id', auth, tableController.deleteTable);

module.exports = router;