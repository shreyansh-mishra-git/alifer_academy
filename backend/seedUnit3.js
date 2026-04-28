const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

const seedUnit3 = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    const existing = await Course.findOne({ title: 'Unit 3 Solutions' });
    if (existing) {
      console.log('Course "Unit 3 Solutions" already exists. Deleting and re-seeding...');
      await Course.deleteOne({ _id: existing._id });
    }

    const course = await Course.create({
      title: 'Unit 3 Solutions',
      description: 'Comprehensive solutions for Unit 3 topics. Includes detailed video explanations and practice PDFs.',
      price: 9,
      originalPrice: 1999,
      duration: 'Lifetime Access',
      category: 'Solutions',
      isActive: true,
      studentsCount: 0,
      videos: [
        { title: 'Unit 3 Intro (FREE)', videoId: '9t-B6pt2K6I', duration: '10:00', isFree: true, isLocked: false, order: 1 },
        { title: 'Part 2', videoId: 'WZ0WgR1QVso', duration: '12:00', isFree: false, isLocked: true, order: 2 },
        { title: 'Part 3', videoId: '5TEN_q1PzNI', duration: '15:00', isFree: false, isLocked: true, order: 3 },
        { title: 'Part 4', videoId: 'dUpyhgb83OE', duration: '11:00', isFree: false, isLocked: true, order: 4 },
        { title: 'Part 5', videoId: 'j92gr-LYWHg', duration: '14:00', isFree: false, isLocked: true, order: 5 },
        { title: 'Part 6', videoId: 'gfZTbGjFXr4', duration: '13:00', isFree: false, isLocked: true, order: 6 },
        { title: 'Part 7', videoId: 'CfGb8LywUgs', duration: '16:00', isFree: false, isLocked: true, order: 7 },
        { title: 'Part 8', videoId: 'lYAcUj8znWM', duration: '12:00', isFree: false, isLocked: true, order: 8 },
        { title: 'Part 9', videoId: 'kg2EO4hiKBk', duration: '14:00', isFree: false, isLocked: true, order: 9 },
        { title: 'Part 10', videoId: 'kQT4Rvb7-hM', duration: '15:00', isFree: false, isLocked: true, order: 10 },
      ],
    });

    console.log('Unit 3 Solutions course seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding course:', error);
    process.exit(1);
  }
};

seedUnit3();
