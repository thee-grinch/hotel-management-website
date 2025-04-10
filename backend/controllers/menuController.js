const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// Get all menu items
exports.getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find().populate('category');

    // Use environment variable for the base URL or fallback to request host
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    // Check if the base URL is defined
    console.log(baseUrl, 'Base URL');
 
    // Add full image URL to each menu item
    const menuItemsWithFullImageUrl = menuItems.map(item => ({
      ...item.toObject(),
      image: item.image ? `${baseUrl}${item.image}` : null
      
    }));

    res.json(menuItemsWithFullImageUrl);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get menu item by ID
exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id).populate('category');
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new menu item (Admin only)
exports.createMenuItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ msg: 'Category does not exist' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    console.log(menuItem, 'Menu Item');
    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update menu item (Admin only)
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    let menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    // Check if category exists
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ msg: 'Category does not exist' });
      }
    }

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

    if (req.file) {
      menuItem.image = `/uploads/${req.file.filename}`;
    }

    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete menu item (Admin only)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    await menuItem.remove();
    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new category (Admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Check if category already exists
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    category = new Category({
      name,
      description
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};