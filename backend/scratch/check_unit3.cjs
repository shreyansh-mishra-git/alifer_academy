const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Course = require('../models/Course');

const checkUnit3 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find({ title: /Unit 3/i });
    console.log('Unit 3 Courses:');
    courses.forEach(c => {
      console.log(`Title: ${c.title}`);
      console.log('Videos:');
      c.videos.forEach(v => {
        console.log(`  - ${v.title}: ${v.videoId}`);
      });
    });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUnit3();
