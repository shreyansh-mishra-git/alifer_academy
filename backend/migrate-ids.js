const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Payment = require('./models/Payment');
const Course = require('./models/Course');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get current active courses
    const arjuna = await Course.findOne({ title: /ARJUNA 3.0/i });
    const drona = await Course.findOne({ title: /DRONA 3.0/i });

    if (!arjuna || !drona) {
      console.error('New courses not found.');
      process.exit(1);
    }

    const NEW_ARJUNA_ID = arjuna._id;
    const NEW_DRONA_ID = drona._id;

    console.log(`Current Arjuna ID: ${NEW_ARJUNA_ID}`);
    console.log(`Current Drona ID: ${NEW_DRONA_ID}`);

    // All possible old IDs identified so far
    const OLD_ARJUNA_IDS = [
      '69ee70c4e85016c0477fd759', 
      '69fa613e35a9fbdeab14af85'
    ]; 
    const OLD_DRONA_IDS = [
      '69e928b6f8d10e23af9eca15',
      '69fa613e35a9fbdeab14af86'
    ];

    const allOldIds = [...OLD_ARJUNA_IDS, ...OLD_DRONA_IDS].map(id => new mongoose.Types.ObjectId(id));

    // 1. Update Payments
    console.log('Updating Payments...');
    const p1 = await Payment.updateMany(
      { courseId: { $in: OLD_ARJUNA_IDS.map(id => new mongoose.Types.ObjectId(id)) } },
      { courseId: NEW_ARJUNA_ID }
    );
    const p2 = await Payment.updateMany(
      { courseId: { $in: OLD_DRONA_IDS.map(id => new mongoose.Types.ObjectId(id)) } },
      { courseId: NEW_DRONA_ID }
    );
    console.log(`Payments updated: Arjuna=${p1.modifiedCount}, Drona=${p2.modifiedCount}`);

    // 2. Update Users Enrolled Courses
    console.log('Updating User Enrollments...');
    const users = await User.find({ 'enrolledCourses.course': { $in: allOldIds } });
    
    let updatedUsers = 0;
    for (const user of users) {
      let changed = false;
      user.enrolledCourses = user.enrolledCourses.map(enrollment => {
        if (!enrollment.course) return enrollment;
        const courseIdStr = enrollment.course.toString();
        
        if (OLD_ARJUNA_IDS.includes(courseIdStr)) {
          enrollment.course = NEW_ARJUNA_ID;
          changed = true;
        } else if (OLD_DRONA_IDS.includes(courseIdStr)) {
          enrollment.course = NEW_DRONA_ID;
          changed = true;
        }
        return enrollment;
      });
      
      if (changed) {
        // Use markModified because we are changing an array of subdocuments manually
        user.markModified('enrolledCourses');
        await user.save();
        updatedUsers++;
      }
    }
    console.log(`Users updated: ${updatedUsers}`);

    console.log('Migration completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

migrate();
