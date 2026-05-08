const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const arjunaData = {
      title: 'Unit 1 - ARJUNA 3.0',
      description: 'Complete Unit 1 preparation for ARJUNA 3.0 with video solutions for DENM Question Bank.',
      price: 9,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'ARJUNA 3.0',
      image: '',
      videos: [
        { title: 'L-1-Unit-1-Part-1-DENM-Q.B.-From Q1 to Q10', videoId: 'iEiiKK60Hws', duration: '26 min', isFree: true, isLocked: false, order: 1 },
        { title: 'L-2-Unit-1-Part-2-DENM-Q.B.-From Q11 to Q20', videoId: 'eew_WQiqF4c', duration: '25 min', isFree: false, isLocked: true, order: 2 },
        { title: 'L-3-Unit-1-Part-3-DENM-Q.B.-From Q21 to Q25', videoId: 'jTH06E8Z064', duration: '32 min', isFree: false, isLocked: true, order: 3 },
        { title: 'L-4-Unit-1-Part-4-DENM-Q.B.-From Q26 to Q30', videoId: 'unNonZTjdV8', duration: '31 min', isFree: false, isLocked: true, order: 4 },
        { title: 'L-5-Unit-1-Part-5-DENM-Q.B.-From Q31 to Q35', videoId: 'ryTcbnsg3d8', duration: '33 min', isFree: false, isLocked: true, order: 5 },
        { title: 'L-6-Unit-1-Part-6-DENM-Q.B. From Q35 to Q40', videoId: 'OsGcfzRsqLg', duration: '49 min', isFree: false, isLocked: true, order: 6 },
      ],
      pdfs: [
        { title: 'L-1-Unit-1-Part-1-DENM-Q.B.-From Q1 to Q10', url: 'https://drive.google.com/file/d/1UfYxCk3a45_cpzA1TRc0zaHroZq0q4qB/preview' },
        { title: 'L-2-Unit-1-Part-2-DENM-Q.B.-From Q11 to Q20', url: 'https://drive.google.com/file/d/1KKZnS90_ZR12a-SdYLn4tQ9Er_o_XNOg/preview' },
        { title: 'L-3-Unit-1-Part-3-DENM-Q.B.-From Q21 to Q25', url: 'https://drive.google.com/file/d/1iEpypxsUwB8uhiR7uPIKsNjyqX6kIaLg/preview' },
        { title: 'L-4-Unit-1-Part-4-DENM-Q.B.-From Q26 to Q30', url: 'https://drive.google.com/file/d/1C0pNvruW0wRW3eZc8atnga7yq5UkxIjJ/preview' },
        { title: 'L-5-Unit-1-Part-5-DENM-Q.B.-From Q31 to Q35', url: 'https://drive.google.com/file/d/1r0GCj1pye64rTJtgDMEfwYZMkq2iOS4y/preview' },
        { title: 'L-6-Unit-1-Part-6-DENM-Q.B.-From Q35 to Q40', url: 'https://drive.google.com/file/d/16gHlpTbhGa-wD8lURyApcT3wONsgBr_l/preview' },
      ]
    };

    const dronaData = {
      title: 'Unit 3 - DRONA 3.0',
      description: 'Complete Unit 3 preparation for DRONA 3.0 with advanced lectures and resources.',
      price: 9,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'DRONA 3.0',
      image: '',
      videos: [
        { title: 'Drona Welcome', videoId: 'FJ4ltLZy3m4', duration: '10 min', isFree: true, isLocked: false, order: 1 },
        { title: 'Lecture 2', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 2 },
        { title: 'Lecture 3', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 3 },
        { title: 'Lecture 4', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 4 },
        { title: 'Lecture 5', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 5 },
        { title: 'Lecture 6', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 6 },
        { title: 'Lecture 7', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 7 },
        { title: 'Lecture 8', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 8 },
        { title: 'Lecture 9', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 9 },
        { title: 'Lecture 10', videoId: 'REPLACE_ME', duration: '45 min', isFree: false, isLocked: true, order: 10 },
      ],
      pdfs: []
    };

    // Use a more surgical update to keep old IDs if possible, or just delete and recreate as per the route logic
    // console.log('Deleting old courses...');
    // We NO LONGER delete because it changes IDs and breaks enrollments.
    // await Course.deleteMany({ title: { $nin: [arjunaData.title, dronaData.title] } });
    
    console.log('Upserting ARJUNA 3.0...');
    await Course.findOneAndUpdate({ title: arjunaData.title }, arjunaData, { upsert: true, new: true });
    
    console.log('Upserting DRONA 3.0...');
    await Course.findOneAndUpdate({ title: dronaData.title }, dronaData, { upsert: true, new: true });

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
