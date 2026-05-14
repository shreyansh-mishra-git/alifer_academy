const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/dashboard — summary for admin panel
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
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
    const users = await User.find({})
      .select('-password')
      .populate('enrolledCourses.course', 'title')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/seed-course — seed or update the courses
router.post('/seed-course', protect, adminOnly, async (req, res) => {
  try {
    const arjunaData = {
      title: 'Unit 1 - ARJUNA 3.0',
      description: 'Complete Unit 1 preparation for ARJUNA 3.0 with video solutions for DENM Question Bank.',
      price: 9,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'ARJUNA 3.0',
      image: '',
      videos: [
        { title: 'L-1-Unit-1-Part-1-DENM-Q.B.-From Q1 to Q10', videoId: 'iEiiKK60Hws', duration: '26 min', isFree: true, isLocked: false, order: 1 },
        { title: 'L-2-Unit-1-Part-2-DENM-Q.B.-From Q11 to Q20', videoId: 'eew_WQiqF4c', duration: '25 min', isFree: false, isLocked: true, order: 2 },
        { title: 'L-3-Unit-1-Part-3-DENM-Q.B.-From Q21 to Q25', videoId: 'jTH06E8Z064', duration: '32 min', isFree: false, isLocked: true, order: 3 },
        { title: 'L-4-Unit-1-Part-4-DENM-Q.B.-From Q26 to Q30', videoId: 'unNonZTjdV8', duration: '31 min', isFree: false, isLocked: true, order: 4 },
        { title: 'L-5-Unit-1-Part-5-DENM-Q.B.-From Q31 to Q35', videoId: 'ryTcbnsg3d8', duration: '33 min', isFree: false, isLocked: true, order: 5 },
        { title: 'L-6-Unit-1-Part-6-DENM-Q.B. From Q35 to Q40', videoId: 'OsGcfzRsqLg', duration: '49 min', isFree: false, isLocked: true, order: 6 },
      ],
      pdfs: [
        { title: 'L-1-Unit-1-Part-1-DENM-Q.B.-From Q1 to Q10', url: 'https://drive.google.com/file/d/1UfYxCk3a45_cpzA1TRc0zaHroZq0q4qB/preview' },
        { title: 'L-2-Unit-1-Part-2-DENM-Q.B.-From Q11 to Q20', url: 'https://drive.google.com/file/d/1KKZnS90_ZR12a-SdYLn4tQ9Er_o_XNOg/preview' },
        { title: 'L-3-Unit-1-Part-3-DENM-Q.B.-From Q21 to Q25', url: 'https://drive.google.com/file/d/1iEpypxsUwB8uhiR7uPIKsNjyqX6kIaLg/preview' },
        { title: 'L-4-Unit-1-Part-4-DENM-Q.B.-From Q26 to Q30', url: 'https://drive.google.com/file/d/1C0pNvruW0wRW3eZc8atnga7yq5UkxIjJ/preview' },
        { title: 'L-5-Unit-1-Part-5-DENM-Q.B.-From Q31 to Q35', url: 'https://drive.google.com/file/d/1r0GCj1pye64rTJtgDMEfwYZMkq2iOS4y/preview' },
        { title: 'L-6-Unit-1-Part-6-DENM-Q.B.-From Q35 to Q40', url: 'https://drive.google.com/file/d/16gHlpTbhGa-wD8lURyApcT3wONsgBr_l/preview' },
      ]
    };

    const dronaData = {
      title: 'Unit 3 - DRONA 3.0',
      description: 'Complete Unit 3 preparation for DRONA 3.0 with advanced lectures and resources.',
      price: 11,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'DRONA 3.0',
      image: '',
      videos: [
        { title: 'Drona Welcome', videoId: 'FJ4ltLZy3m4', duration: '10 min', isFree: true, isLocked: false, order: 1 },
        { title: 'Lecture 2', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 2 },
        { title: 'Lecture 3', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 3 },
        { title: 'Lecture 4', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 4 },
        { title: 'Lecture 5', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 5 },
        { title: 'Lecture 6', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 6 },
        { title: 'Lecture 7', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 7 },
        { title: 'Lecture 8', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 8 },
        { title: 'Lecture 9', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 9 },
        { title: 'Lecture 10', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 10 },
      ],
      pdfs: []
    };

    await Course.deleteMany({ title: { $nin: [arjunaData.title, dronaData.title] } });
    await Course.findOneAndUpdate({ title: arjunaData.title }, arjunaData, { upsert: true, new: true });
    await Course.findOneAndUpdate({ title: dronaData.title }, dronaData, { upsert: true, new: true });

    res.status(201).json({ message: 'Courses seeded/updated successfully' });
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
