const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

// @route   POST api/reservations
// @desc    Create a reservation
// @access  Private
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

// @route   GET api/reservations
// @desc    Get all reservations
// @access  Private
router.get('/', auth, reservationController.getReservations);

// @route   PUT api/reservations/:id/status
// @desc    Update reservation status
// @access  Private/Admin
router.put('/:id/status', auth, reservationController.updateReservationStatus);

// @route   DELETE api/reservations/:id
// @desc    Delete reservation
// @access  Private
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;