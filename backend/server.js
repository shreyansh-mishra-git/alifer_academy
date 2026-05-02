const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

const { protect, adminOnly } = require('./middleware/auth');
const Payment = require('./models/Payment');
const User = require('./models/User');
const Course = require('./models/Course');

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json()); // CRITICAL for parsing JSON bodies

// ===== CORS FIX =====
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'https://alifer-academy.vercel.app',
  'https://alifer-academy.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ===== DATABASE CONNECTION =====
connectDB();

// ===== ROUTES (Mounting Auth Routes) =====
app.use('/api/auth', authRoutes);   // THIS IS THE CRITICAL MOUNT
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

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});