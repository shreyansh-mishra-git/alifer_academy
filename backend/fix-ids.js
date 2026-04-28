const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const fixIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const courses = await db.collection('courses').find({}).toArray();
    
    for (const course of courses) {
      if (typeof course._id === 'string' && course._id.length === 24) {
        console.log(`Fixing ID for course: ${course.title}`);
        const newId = new mongoose.Types.ObjectId(course._id);
        
        // Remove the string ID entry and insert with ObjectId
        await db.collection('courses').deleteOne({ _id: course._id });
        course._id = newId;
        await db.collection('courses').insertOne(course);
        
        console.log(`Converted string ID ${course._id} to ObjectId`);
      }
    }
    
    console.log('Database cleanup complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixIds();
