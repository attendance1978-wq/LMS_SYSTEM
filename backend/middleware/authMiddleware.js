const jwt = require('jsonwebtoken');
const serverConfig = require('../config/serverConfig');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    const decoded = jwt.verify(token, serverConfig.jwtSecret);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found or deactivated' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role '${req.user.role}' is not allowed.`,
      });
    }
    next();
  };
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, serverConfig.jwtSecret, {
    expiresIn: serverConfig.jwtExpiresIn,
  });
};

module.exports = { protect, authorize, generateToken };
