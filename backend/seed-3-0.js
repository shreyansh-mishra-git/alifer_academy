const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Course = require('./models/Course');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const arjuna3Data = {
      title: 'Unit 1 - ARJUNA 3.0',
      description: 'Complete Unit 1 preparation for ARJUNA 3.0 with video solutions for DENM Question Bank.',
      price: 9,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'ARJUNA 3.0',
      image: '',
      isFull: true,
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

    const arjuna4Data = {
      title: 'Unit 1 - ARJUNA 4.0',
      description: 'The latest ARJUNA 4.0 batch for Unit 1. Enrollment is now open!',
      price: 9,
      originalPrice: 1999,
      duration: '30 Days Access',
      category: 'ARJUNA 4.0',
      image: '',
      isFull: false,
      videos: arjuna3Data.videos,
      pdfs: arjuna3Data.pdfs
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
        { title: 'PDE L 1 CH 1 Type 1&2 Formation of PDE by Eliminating Arbitrary Constant and Arbitrary Function', videoId: '9t-B6pt2K6I', duration: '26 min', isFree: true, isLocked: false, order: 1 },
        { title: 'PDE L 2 CH 1 Type 3&4 Solution of Non Homogeneous & Homogeneous PDE by Direct Integration Method', videoId: 'WZ0WgR1QVso', duration: '25 min', isFree: false, isLocked: true, order: 2 },
        { title: 'PDE L 3 CH 2 Type 1 Lagrang\'PDE Part 1', videoId: '5TEN_q1PzNI', duration: '32 min', isFree: false, isLocked: true, order: 3 },
        { title: 'PDE L 4 CH 2 Type 1 Lagrang\'PDE Part 2', videoId: 'dUpyhgb83OE', duration: '31 min', isFree: false, isLocked: true, order: 4 },
        { title: 'PDE L 5 CH 3 Type 1 Standard Forms of Non Linear PDEs', videoId: 'CfGb8LywUgs', duration: '16 min', isFree: false, isLocked: true, order: 5 },
        { title: 'PDE L 6 CH 3 Type 2 Charpit\'s Method', videoId: 'j92gr-LYWHg', duration: '33 min', isFree: false, isLocked: true, order: 6 },
        { title: 'PDE L 7 CH 4 Type 1&2 Classification of PDE & Homogeneous PDEs', videoId: 'gfZTbGjFXr4', duration: '49 min', isFree: false, isLocked: true, order: 7 },
        { title: 'PDE L 8 CH 4 Type 3 Homogeneous FD,D\'=fx,y', videoId: 'lYAcUj8znWM', duration: '12 min', isFree: false, isLocked: true, order: 8 },
        { title: 'PDE L 9 CH 4 Type 4 Non Homogeneous PDE of the Form FD,D\'=fx,y', videoId: 'kQT4Rvb7-hM', duration: '15 min', isFree: false, isLocked: true, order: 9 },
        { title: 'PDE L 10 CH 4 Type 5 Euler\'s PDE', videoId: 'kg2EO4hiKBk', duration: '14 min', isFree: false, isLocked: true, order: 10 },
      ],
      pdfs: []
    };

    // Use a more surgical update to keep old IDs if possible, or just delete and recreate as per the route logic
    // console.log('Deleting old courses...');
    // We NO LONGER delete because it changes IDs and breaks enrollments.
    // await Course.deleteMany({ title: { $nin: [arjunaData.title, dronaData.title] } });
    
    console.log('Upserting ARJUNA 3.0...');
    await Course.findOneAndUpdate({ title: arjuna3Data.title }, arjuna3Data, { upsert: true, new: true });

    console.log('Upserting ARJUNA 4.0...');
    await Course.findOneAndUpdate({ title: arjuna4Data.title }, arjuna4Data, { upsert: true, new: true });
    
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
