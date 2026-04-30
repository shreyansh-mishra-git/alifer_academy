const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id, sessionId) =>
  jwt.sign({ id, sessionId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    User Signup (direct registration — no OTP)
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, age, phone, password } = req.body;

    if (!name || !email || !age || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user directly — no OTP step
    const user = await User.create({
      name,
      email,
      phone,
      password, // hashed by User model pre-save hook
      age: Number(age),
    });

    // Auto-login: generate session
    const newSessionId = crypto.randomBytes(16).toString('hex');
    user.activeSessionId = newSessionId;
    await user.save();

    res.status(201).json({
      message: 'Account created successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, newSessionId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @desc    User Login (with single-device check)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).populate('enrolledCourses', '_id title price');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Single-device login: replace active session
    const newSessionId = crypto.randomBytes(16).toString('hex');
    user.activeSessionId = newSessionId;
    user.lastStudied = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, newSessionId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    User Logout
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.activeSessionId = null;
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses', '_id title price image category');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
