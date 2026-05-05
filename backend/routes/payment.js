const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/enroll/request — user submits payment request (Requirement 4)
router.post('/request', protect, async (req, res) => {
  try {
    const { courseId, utrNumber } = req.body;

    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled (active)
    const user = await User.findById(req.user._id);
    const now = new Date();
    const isAlreadyActive = user.enrolledCourses.some(e => 
      String(e.course) === String(courseId) && (!e.expiresAt || e.expiresAt > now)
    );
    if (isAlreadyActive) {
      return res.status(400).json({ message: 'Already enrolled in this course and access is active' });
    }

    // Check for existing pending payment
    const existingPayment = await Payment.findOne({
      userId: req.user._id,
      courseId,
      status: 'pending',
    });
    if (existingPayment) {
      return res.status(400).json({
        message: 'Payment already submitted and pending approval',
        payment: existingPayment,
      });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      courseId,
      amount: 9, // Hardcoded price as per requirement
      utrNumber: utrNumber || '',
      status: 'pending',
      createdAt: new Date(), // Explicitly capture server time
    });

    res.status(201).json({
      message: 'Payment request submitted. Admin will verify shortly.',
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Alias for Requirement 4
router.post('/enroll/request', protect, async (req, res) => {
  // Transfer control to /request logic
  req.url = '/request';
  return router.handle(req, res);
});

// GET /api/payment/my — get current user's payments
router.get('/my', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/payment/all — admin: list all payments
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', '-password')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/payment/approve/:paymentId — admin approves and enrolls user
router.patch('/approve/:paymentId', protect, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status === 'approved') {
      return res.status(400).json({ message: 'Already approved' });
    }

    // Update payment status
    payment.status = 'approved';
    payment.approvedAt = new Date();
    payment.approvedBy = req.user._id;
    await payment.save();

    // Enroll user in course with 1 month expiry
    const user = await User.findById(payment.userId);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days access

    // Set global subscription expiry if not already set or if sooner
    if (!user.subscriptionExpiry || user.subscriptionExpiry < expiresAt) {
      user.subscriptionExpiry = expiresAt;
    }

    // Check if user already has this course (update or add)
    const courseIndex = user.enrolledCourses.findIndex(e => String(e.course) === String(payment.courseId));
    if (courseIndex > -1) {
      user.enrolledCourses[courseIndex].expiresAt = expiresAt;
      user.enrolledCourses[courseIndex].enrolledAt = new Date();
    } else {
      user.enrolledCourses.push({
        course: payment.courseId,
        enrolledAt: new Date(),
        expiresAt: expiresAt
      });
    }
    await user.save();

    // Increment course student count
    await Course.findByIdAndUpdate(payment.courseId, { $inc: { studentsCount: 1 } });

    // Get course for email log
    const course = await Course.findById(payment.courseId);

    // Mock Email Notification
    console.log(`Sending email to ${user.email}: Your enrollment for "${course.title}" is now active!`);

    res.json({ message: 'Payment approved and user enrolled successfully', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/payment/reject/:paymentId — admin rejects payment
router.patch('/reject/:paymentId', protect, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'rejected';
    await payment.save();

    res.json({ message: 'Payment rejected', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
