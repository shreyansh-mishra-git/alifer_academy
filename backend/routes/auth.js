const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendOTPEmail } = require('../config/email');

const generateToken = (id, sessionId) =>
  jwt.sign({ id, sessionId }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    User Signup
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    let { name, email, phone, password } = req.body;
    if (email) email = email.trim();

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newSessionId = crypto.randomBytes(16).toString('hex');
    const user = await User.create({
      name,
      email,
      phone,
      password,
      isVerified: true, // Auto verify since OTP is removed
      activeSessionId: newSessionId,
      lastStudied: new Date(),
    });

    res.status(201).json({
      message: 'User registered successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      enrolledCourses: [],
      studyStreak: user.studyStreak,
      hoursStudied: user.hoursStudied,
      completedVideos: [],
      token: generateToken(user._id, newSessionId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @desc    User Login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.trim();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Create session
    const newSessionId = crypto.randomBytes(16).toString('hex');
    user.activeSessionId = newSessionId;
    user.lastStudied = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      enrolledCourses: user.enrolledCourses,
      studyStreak: user.studyStreak,
      hoursStudied: user.hoursStudied,
      completedVideos: user.completedVideos,
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

// @desc    Get current user profile & update streak
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.course');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Streak Logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (user.lastStudied) {
      const last = new Date(user.lastStudied);
      const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.studyStreak += 1;
        user.lastStudied = now;
        await user.save();
      } else if (diffDays > 1) {
        // Streak broken
        user.studyStreak = 1;
        user.lastStudied = now;
        await user.save();
      } else if (diffDays === 0) {
        // Already active today, just update time for accuracy if needed
        // (optional: update user.lastStudied = now if you want exact timestamp)
      }
    } else {
      // First time studying
      user.studyStreak = 1;
      user.lastStudied = now;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
