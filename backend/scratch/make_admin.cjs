const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await User.findOneAndUpdate(
      { email: email },
      { isAdmin: true },
      { new: true }
    );

    if (result) {
      console.log(`User ${email} is now an admin!`);
    } else {
      console.log(`User with email ${email} not found.`);
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address.');
  process.exit(1);
}

makeAdmin(email);
