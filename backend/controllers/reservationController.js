const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { validationResult } = require('express-validator');

// Create a new reservation
exports.createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tableId, date, time } = req.body;
    const userId = req.user.id;

    // Check if table exists and is available
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ msg: 'Table not found' });
    }

    // Check for existing reservation at same time
    const existingReservation = await Reservation.findOne({
      table: tableId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingReservation) {
      return res.status(400).json({ msg: 'Table already reserved for this time' });
    }

    const reservation = new Reservation({
      user: userId,
      table: tableId,
      date,
      time,
      status: 'pending'
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all reservations
exports.getReservations = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const filter = {};

    if (date) {
      filter.date = new Date(date);
    }
    if (status) {
      filter.status = status;
    }

    // Admins can see all reservations, users see only their own
    if (req.user.role === 'customer') {
      filter.user = req.user.id;
    }

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate('table', 'number capacity')
      .sort({ date: 1, time: 1 });

    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Only admin can update status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    reservation.status = status;
    await reservation.save();

    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete reservation
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Reservation not found' });
    }

    // Only admin or the user who made the reservation can delete
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await reservation.remove();
    res.json({ msg: 'Reservation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};