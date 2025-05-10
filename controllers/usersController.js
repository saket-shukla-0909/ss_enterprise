// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const register = async (req, res) => {
  try {
    const { full_name, father_name, dob, gender, mobile, password } = req.body;

    // Check if all required fields are provided
    if (!full_name || !dob || !gender || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the mobile number already exists
    const existingUser = await User.findOne({ where: { mobile } });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      full_name,
      father_name,
      dob,
      gender,
      mobile,
      password: hashedPassword,
    });

    // Respond with success
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        full_name: newUser.full_name,
        mobile: newUser.mobile,
        dob: newUser.dob,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, try again later' });
  }
};

// Login function
const login = async (req, res) => {
    const { mobile, password } = req.body;
  
    try {
      // Find the user by mobile number
      const user = await User.findOne({ where: { mobile } });
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Compare the entered password with the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, mobile: user.mobile }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Token expiration (1 hour in this case)
      );
  
      // Optionally, store the token in the database (e.g., in the user's token field)
      await user.update({ token });
  
      // Return the token and user info
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          mobile: user.mobile,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// Logout function
const logout = async (req, res) => {
    try {
      const user = await User.findByPk(req.userId);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      await user.update({ token: null });
  
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

//   Get All Users function
const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password', 'token'] }
      });
  
      res.status(200).json({
        message: 'Users fetched successfully',
        users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Update function
const updatePassword = async (req, res) => {
    
  const userId = req.user.id; // Comes from JWT middleware
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { register, login, logout, getAllUsers, updatePassword };
