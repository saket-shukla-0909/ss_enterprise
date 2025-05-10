// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authMiddlewares');

// User registration route
router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.post('/logout', authenticateToken,  userControllers.logout);
router.get('/allUsers', authenticateToken, userControllers.getAllUsers);
router.put('/update-password', authenticateToken, userControllers.updatePassword);


module.exports = router;
