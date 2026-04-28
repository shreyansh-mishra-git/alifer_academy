const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, age, phone, password } = req.body;

    if (!name || !email || !age || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, age: Number(age), phone, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      phone: user.phone,
      isAdmin: user.isAdmin,
      enrolledCourses: user.enrolledCourses,
      studyStreak: user.studyStreak,
      hoursStudied: user.hoursStudied,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).populate('enrolledCourses', '_id title price');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update study streak
    const now = new Date();
    const lastStudied = user.lastStudied;
    if (lastStudied) {
      const diffDays = Math.floor((now - lastStudied) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.studyStreak += 1;
      } else if (diffDays > 1) {
        user.studyStreak = 1;
      }
    } else {
      user.studyStreak = 1;
    }
    user.lastStudied = now;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      phone: user.phone,
      isAdmin: user.isAdmin,
      enrolledCourses: user.enrolledCourses,
      studyStreak: user.studyStreak,
      hoursStudied: user.hoursStudied,
      completedVideos: user.completedVideos,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me  — get current user profile
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
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
