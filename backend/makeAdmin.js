/**
 * Script to create an admin user in MongoDB
 * Run with: node makeAdmin.js <email>
 * Example:  node makeAdmin.js admin@alifer.com
 * 
 * Or: node makeAdmin.js create
 * Creates a default admin: admin@alifer.com / admin123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
};

const run = async () => {
  await connectDB();

  const action = process.argv[2];

  if (action === 'create') {
    // Create default admin
    const existing = await User.findOne({ email: 'admin@alifer.com' });
    if (existing) {
      existing.isAdmin = true;
      await existing.save();
      console.log('✅ Existing user set as admin: admin@alifer.com');
    } else {
      const admin = await User.create({
        name: 'Alifer Admin',
        email: 'admin@alifer.com',
        age: 25,
        phone: '9999999999',
        password: 'admin123',
        isAdmin: true,
      });
      console.log('✅ Admin created! Email: admin@alifer.com | Password: admin123');
      console.log('   Admin ID:', admin._id);
    }
  } else if (action) {
    // Make existing user admin by email
    const user = await User.findOne({ email: action });
    if (!user) {
      console.log(`❌ No user found with email: ${action}`);
    } else {
      user.isAdmin = true;
      await user.save();
      console.log(`✅ ${user.name} (${user.email}) is now an admin!`);
    }
  } else {
    console.log('Usage:');
    console.log('  node makeAdmin.js create          — Create default admin');
    console.log('  node makeAdmin.js user@email.com  — Make existing user admin');
  }

  mongoose.disconnect();
};

run().catch((err) => { console.error(err); mongoose.disconnect(); });
