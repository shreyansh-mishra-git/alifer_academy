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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      name,
      email,
      phone,
      password,
      otp,
      otpExpiry,
      isVerified: false, // Ensure not verified yet
      lastOtpSent: new Date(),
    });

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email failed:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP email. Please try again.',
        error: emailError.message 
      });
    }

    res.status(201).json({
      message: 'OTP sent to email. Please verify to complete registration.',
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// @desc    User Login (Triggers OTP)
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

    // Generate 6-digit OTP for login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.lastOtpSent = new Date();
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email failed:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailError.message
      });
    }

    res.json({
      message: 'OTP sent to your email. Please verify to login.',
      email: user.email,
      requiresOtp: true // Flag for frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Verify OTP (Works for both Signup and Login)
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified and invalidate OTP (single-use)
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    // Create session
    const newSessionId = crypto.randomBytes(16).toString('hex');
    user.activeSessionId = newSessionId;
    user.lastStudied = new Date();
    await user.save();

    res.json({
      message: 'Verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, newSessionId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check cooldown (60 seconds)
    const now = new Date();
    if (user.lastOtpSent && (now - user.lastOtpSent) < 60000) {
      const waitTime = Math.ceil((60000 - (now - user.lastOtpSent)) / 1000);
      return res.status(400).json({ message: `Please wait ${waitTime}s before resending` });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.lastOtpSent = now;
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email failed:', emailError);
      return res.status(500).json({ 
        message: 'Failed to send OTP email',
        error: emailError.message
      });
    }

    res.json({ message: 'New OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP resend' });
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
