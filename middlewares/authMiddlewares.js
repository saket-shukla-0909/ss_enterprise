const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');



const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: 'Token missing' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Validate token against DB
    const user = await User.findByPk(decoded.id);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user ID to request
    req.userId = decoded.id;

    next(); // Proceed to next middleware or controller
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
