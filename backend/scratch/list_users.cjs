const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('name email isAdmin');
    console.log('Current Users:');
    console.log(JSON.stringify(users, null, 2));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listUsers();
