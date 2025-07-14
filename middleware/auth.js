const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.SECRET_KEY

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: 'Account not found' });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ meesage: "Invalid token" })
    }
}

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden - No permission' });
        }
        next();
    };
};

// Bắt buộc phải đăng nhập (user hoặc admin)
exports.requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  next();
};

// Bắt buộc phải là admin
exports.requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/users/login');
  }
  next();
};

  module.exports = {
    authMiddleWare,
    requireRole,
    requireLogin: exports.requireLogin,
    requireAdmin: exports.requireAdmin
  };