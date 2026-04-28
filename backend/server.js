// ===== LOAD ENV (SAFE + RELIABLE) =====
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

// ===== DEBUG (STEP 1: CHECK EVERYTHING) =====
console.log("📁 ENV FILE PATH:", envPath);
console.log("🧪 ALL ENV:", process.env);

// ===== DEBUG (STEP 2: CHECK MONGO_URI) =====
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is UNDEFINED");
  console.error("👉 Fix: .env file issue (location / name / format / encoding)");
  process.exit(1);
} else {
  console.log("🔑 ENV CHECK — MONGO_URI: ✅ Loaded");
}

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

// ===== START SERVER ONLY AFTER DB CONNECT =====
const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // ===== MIDDLEWARE =====
    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
      credentials: true,
    }));
    app.use(express.json());

    // ===== ROUTES =====
    app.use('/api/auth', authRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/enroll', paymentRoutes);
    app.use('/api/admin', adminRoutes);

    // Specific secret dashboard route for Requirement
    const { protect, adminOnly } = require('./middleware/auth');
    const Payment = require('./models/Payment');
    const User = require('./models/User');
    const Course = require('./models/Course');
    
    app.get('/api/admin-dashboard-secret', protect, adminOnly, async (req, res) => {
      try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalCourses = await Course.countDocuments();
        const pendingPayments = await Payment.countDocuments({ status: 'pending' });
        const approvedPayments = await Payment.countDocuments({ status: 'approved' });
        const recentPayments = await Payment.find({ status: 'pending' })
          .populate('userId', 'name email phone')
          .populate('courseId', 'title price')
          .sort({ createdAt: -1 }).limit(10);
        res.json({ totalUsers, totalCourses, pendingPayments, approvedPayments, recentPayments });
      } catch (e) { res.status(500).json({ message: 'Error' }); }
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
      console.error("🔥 ERROR:", err.stack);
      res.status(500).json({ message: 'Internal server error' });
    });

    // ===== START SERVER =====
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();