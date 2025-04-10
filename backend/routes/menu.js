const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const menuController = require('../controllers/menuController');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/items', menuController.getMenuItems);
router.get('/items/:id', menuController.getMenuItem);

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

router.put('/items/:id', auth, upload.single('image'), menuController.updateMenuItem);
router.delete('/items/:id', auth, menuController.deleteMenuItem);

router.get('/categories', menuController.getCategories);

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