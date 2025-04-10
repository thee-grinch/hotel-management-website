const express = require('express');
const { check } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a reservation
router.post(
  '/',
  [
    auth,
    [
      check('tableId', 'Table ID is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty()
    ]
  ],
  reservationController.createReservation
);

// Get all reservations
router.get('/', auth, reservationController.getReservations);

// Update reservation status
router.put('/:id/status', auth, reservationController.updateReservation);

// Delete a reservation
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;