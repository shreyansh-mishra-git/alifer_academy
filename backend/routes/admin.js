const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/dashboard — summary for admin panel
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalCourses = await Course.countDocuments();
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const approvedPayments = await Payment.countDocuments({ status: 'approved' });

    const recentPayments = await Payment.find({ status: 'pending' })
      .populate('userId', '-password')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ totalUsers, totalCourses, pendingPayments, approvedPayments, recentPayments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .populate('enrolledCourses', 'title')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/seed-course — seed the "Question Bank 1" course
router.post('/seed-course', protect, adminOnly, async (req, res) => {
  try {
    const existing = await Course.findOne({ title: 'Question Bank 1' });
    if (existing) return res.json({ message: 'Course already exists', course: existing });

    const course = await Course.create({
      title: 'Question Bank 1',
      description: 'Complete question bank with PYQs, practice sets and topic-wise questions for competitive exam preparation.',
      price: 9,
      originalPrice: 1999,
      duration: 'Lifetime Access',
      category: 'Question Bank',
      image: '',
      videos: [
        {
          title: 'Welcome & Course Overview',
          videoId: 'FJ4ltLZy3m4', // Replace with actual free video ID
          duration: '15 min',
          isFree: true,
          isLocked: false,
          order: 1,
        },
        {
          title: 'Topic 1: Polity Basics',
          videoId: 'REPLACE_WITH_PRIVATE_VIDEO_ID_1',
          duration: '45 min',
          isFree: false,
          isLocked: true,
          order: 2,
        },
        {
          title: 'Topic 2: History & Geography',
          videoId: 'REPLACE_WITH_PRIVATE_VIDEO_ID_2',
          duration: '50 min',
          isFree: false,
          isLocked: true,
          order: 3,
        },
        {
          title: 'Topic 3: Economy & Science',
          videoId: 'REPLACE_WITH_PRIVATE_VIDEO_ID_3',
          duration: '40 min',
          isFree: false,
          isLocked: true,
          order: 4,
        },
        {
          title: 'Mock Test Discussion',
          videoId: 'REPLACE_WITH_PRIVATE_VIDEO_ID_4',
          duration: '60 min',
          isFree: false,
          isLocked: true,
          order: 5,
        },
      ],
    });

    res.status(201).json({ message: 'Question Bank 1 seeded successfully', course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error seeding course' });
  }
});

// POST /api/admin/enroll-manual — manually enroll a user in a course
router.post('/enroll-manual', protect, adminOnly, async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ message: 'userId and courseId are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days access

    const courseIndex = user.enrolledCourses.findIndex(e => String(e.course) === String(courseId));
    if (courseIndex > -1) {
      user.enrolledCourses[courseIndex].expiresAt = expiresAt;
      user.enrolledCourses[courseIndex].enrolledAt = new Date();
    } else {
      user.enrolledCourses.push({
        course: courseId,
        enrolledAt: new Date(),
        expiresAt: expiresAt
      });
    }
    await user.save();

    res.json({ message: `Successfully enrolled ${user.name} in ${course.title}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
