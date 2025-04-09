const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const usersController = require('../controllers/userController');

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', auth, usersController.getUsers);

// @route   PUT api/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/:id/role', auth, usersController.updateUserRole);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', auth, usersController.deleteUser);

module.exports = router;