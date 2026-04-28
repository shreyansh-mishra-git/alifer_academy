const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

const checkId = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const all = await Course.find({}).lean();
    console.log('Count:', all.length);
    all.forEach(c => {
      console.log(`ID: "${c._id}" | Type: ${typeof c._id} | Constructor: ${c._id.constructor.name} | Title: "${c.title}"`);
    });
    
    const targetId = '69e928b6f8d10e23af9eca15';
    // Try finding by raw string if it's not an ObjectId
    const rawFind = await mongoose.connection.db.collection('courses').findOne({ _id: targetId });
    console.log('Raw DB Find (String ID):', rawFind);
    
    const objIdFind = await mongoose.connection.db.collection('courses').findOne({ _id: new mongoose.Types.ObjectId(targetId) });
    console.log('Raw DB Find (ObjectId):', objIdFind);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkId();
