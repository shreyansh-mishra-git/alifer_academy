// ===== LOAD ENV =====
require('dotenv').config();

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

const { protect, adminOnly } = require('./middleware/auth');
const Payment = require('./models/Payment');
const User = require('./models/User');
const Course = require('./models/Course');

// ===== START SERVER =====
const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // ===== CORS FIX (IMPORTANT) =====
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'https://alifer-academy.vercel.app' // ✅ YOUR FRONTEND
    ];

    app.use(cors({
      origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }));

    app.use(express.json());

    // ===== ROUTES =====
    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/enroll', paymentRoutes);
    app.use('/api/admin', adminRoutes);

    // ===== ADMIN DASHBOARD =====
    app.get('/api/admin-dashboard-secret', protect, adminOnly, async (req, res) => {
      try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalCourses = await Course.countDocuments();
        const pendingPayments = await Payment.countDocuments({ status: 'pending' });
        const approvedPayments = await Payment.countDocuments({ status: 'approved' });

        const recentPayments = await Payment.find({ status: 'pending' })
          .populate('userId', 'name email phone')
          .populate('courseId', 'title price')
          .sort({ createdAt: -1 })
          .limit(10);

        res.json({
          totalUsers,
          totalCourses,
          pendingPayments,
          approvedPayments,
          recentPayments
        });
      } catch (e) {
        res.status(500).json({ message: 'Error loading dashboard' });
      }
    });

    // ===== HEALTH CHECK =====
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Alifer Academy API running' });
    });

    // ===== 404 =====
    app.use((req, res) => {
      res.status(404).json({ message: 'API route not found' });
    });

    // ===== ERROR HANDLER =====
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message || 'Internal server error' });
    });

    // ===== START =====
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();