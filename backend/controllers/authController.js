const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { validationResult } = require('express-validator');

exports.createAdmin = async (req, res, next) => {
  user = new User({
    name: 'Admin',
    email: 'admin@myhotel.com',
    password: 'admin123',
    role: 'admin',
    phone: '1234567890',
    address: '123 Admin St, Admin City, Admin State, 12345'
  });
  await user.save();
  console.log('Admin created');
}

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if this is the first user
    const isFirstUser = (await User.countDocuments()) === 0;

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: isFirstUser ? 'admin' : role || 'customer', // First user is admin
      phone,
      address,
    });

    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpire },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  // console.log(req.headers);
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};