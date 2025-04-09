const staff = (req, res, next) => {
  if (req.user?.role !== 'staff' && req.user?.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied: Staff only' });
  }
  next();
};

module.exports = staff;