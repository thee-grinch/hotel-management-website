const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = (req, res, next) => {
console.log(req.path);
if (req.path === '/api/auth/login' || req.path === '/api/auth/signup') {
    return next();
  }
  console.log(req.path);
  if (req.path === '/api/auth/login' || req.path === '/api/auth/signup') {
    return next();
  }
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;