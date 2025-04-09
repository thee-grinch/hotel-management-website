const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const menuController = require('../controllers/menuController');
const upload = require('../middleware/upload');

// @route   GET api/menu/items
// @desc    Get all menu items
// @access  Public
router.get('/items', menuController.getMenuItems);

// @route   GET api/menu/items/:id
// @desc    Get menu item by ID
// @access  Public
router.get('/items/:id', menuController.getMenuItem);

// @route   POST api/menu/items
// @desc    Create menu item
// @access  Private/Admin
router.post(
  '/items',
  [
    auth,
    upload.single('image'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price is required').isNumeric(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  menuController.createMenuItem
);

// @route   PUT api/menu/items/:id
// @desc    Update menu item
// @access  Private/Admin
router.put('/items/:id', auth, upload.single('image'), menuController.updateMenuItem);

// @route   DELETE api/menu/items/:id
// @desc    Delete menu item
// @access  Private/Admin
router.delete('/items/:id', auth, menuController.deleteMenuItem);

// @route   GET api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', menuController.getCategories);

// @route   POST api/menu/categories
// @desc    Create category
// @access  Private/Admin
router.post(
  '/categories',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty()
    ]
  ],
  menuController.createCategory
);

module.exports = router;