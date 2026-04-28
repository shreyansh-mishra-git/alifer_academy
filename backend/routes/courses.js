const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/courses — list all courses (videos stripped of IDs for non-enrolled users)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).select(
      '_id title description price originalPrice duration category image studentsCount videos'
    );

    // Strip videoId from locked videos for public listing
    const sanitized = courses.map((course) => {
      const c = course.toObject();
      c.videos = c.videos.map((v) => ({
        _id: v._id,
        title: v.title,
        duration: v.duration,
        isFree: v.isFree,
        isLocked: v.isLocked,
        order: v.order,
        // Only include videoId for free videos
        videoId: v.isFree ? v.videoId : undefined,
      }));
      return c;
    });

    res.json(sanitized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/:id — get single course detail
// Logic: 
// 1. One video is free BUT only playable if logged in.
// 2. Other videos are locked and only playable if enrolled (paid).
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested Course ID:", id);

    // Standard retrieval
    const course = await Course.findById(id);
    if (!course) {
      console.log("Course not found in DB for ID:", id);
      return res.status(404).json({ message: 'Course not found' });
    }

    let isEnrolled = false;
    let isPaymentPending = false;
    let currentUser = null;
    
    // Check for user login
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUser = await User.findById(decoded.id);
        
        if (currentUser) {
          // Check active enrollment (must be in enrolledCourses AND not expired)
          const now = new Date();
          isEnrolled = currentUser.enrolledCourses.some(e => 
            String(e.course) === String(course._id) && (!e.expiresAt || e.expiresAt > now)
          );
          
          if (!isEnrolled) {
            // Check pending payment
            const Payment = require('../models/Payment');
            const pendingPayment = await Payment.findOne({
              userId: currentUser._id,
              courseId: course._id,
              status: 'pending'
            });
            if (pendingPayment) isPaymentPending = true;
          }
        }
      } catch (e) {
        console.error("JWT Verification error in course detail:", e.message);
      }
    }

    const c = course.toObject();
    c.isEnrolled = isEnrolled;
    c.isPaymentPending = isPaymentPending;
    
    // Video Access Logic:
    // - Free videos: videoId sent ONLY if user is logged in.
    // - Premium videos: videoId sent ONLY if user is enrolled.
    c.videos = c.videos.map((v) => {
      const canSeeFree = v.isFree && currentUser;
      const canSeePaid = isEnrolled;
      const hasAccess = canSeeFree || canSeePaid;

      return {
        _id: v._id,
        title: v.title,
        duration: v.duration,
        isFree: v.isFree,
        isLocked: !hasAccess,
        order: v.order,
        videoId: hasAccess ? v.videoId : undefined,
      };
    });

    res.json(c);
  } catch (error) {
    console.error("Error in GET /api/courses/:id:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/courses — create course (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, price, originalPrice, duration, category, image, videos } = req.body;
    const course = await Course.create({
      title, description, price, originalPrice, duration, category, image, videos: videos || [],
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

// PATCH /api/courses/:id/complete-video — mark a video watched
router.patch('/:id/complete-video', protect, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.map(String).includes(req.params.id)) {
      // Allow free videos to be tracked even without enrollment
    }

    if (!user.completedVideos.includes(videoId)) {
      user.completedVideos.push(videoId);
      user.hoursStudied += 0.25; // ~15 min per video
      await user.save();
    }

    res.json({ completedVideos: user.completedVideos, hoursStudied: user.hoursStudied });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
