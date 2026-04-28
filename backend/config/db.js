const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Debug log — shows if env variable was received from server.js
  console.log('🔍 ENV CHECK — MONGO_URI:', uri ? '✅ Received' : '❌ UNDEFINED');

  if (!uri) {
    console.error('❌ MONGO_URI is undefined!');
    console.error('   → Make sure your .env file exists inside the backend/ folder');
    console.error('   → Make sure it contains: MONGO_URI=mongodb+srv://...');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
