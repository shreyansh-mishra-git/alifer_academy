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
      price: 11,
      originalPrice: 2499,
      duration: '30 Days Access',
      category: 'DRONA 3.0',
      image: '',
      videos: [
        { title: 'PDE-L-1-CH-1-Type-1&2-Formation of PDE by Eliminating Arbitrary Constants', videoId: '9t-B6pt2K6I', duration: '2:58:04 min', isFree: true, isLocked: false, order: 1 },
        { title: 'PDE-L-3-CH-2-Type-1-Langrange-PDE-Part-1', videoId: '5TEN_q1PzNI', duration: '2:29:54 min', isFree: false, isLocked: true, order: 2 },
        { title: 'PDE-L-3-CH-2-Type-1-Langrange-PDE-Part-1', videoId: '5TEN_q1PzNI', duration: '2:29:54 min', isFree: false, isLocked: true, order: 3 },
        { title: 'PDE-L-6-CH-3-Type-2-Charpit Method', videoId: 'j92gr-LYWHg', duration: '2:52:14 min', isFree: false, isLocked: true, order: 4 },
        { title: 'PDE-L-7-CH-4-Type-1&2-Classification of PDE & homogeneous PDEs', videoId: 'gfZTbGjFXr4', duration: '2:25:40 min', isFree: false, isLocked: true, order: 5 },
        { title: 'PDE-L-8-CH-4-Type-3-Homogeneous F(D,D")=f(x,y)', videoId: 'lYAcUj8znWM', duration: '2:04:03 min', isFree: false, isLocked: true, order: 6 },
      ],
      pdfs: [
        { title: 'PDE-L-1-CH-1-Type-1&2-Formation of PDE by Eliminating Arbitrary Constants', url: 'https://drive.google.com/file/d/1D60-0MAbm722zqoi1k5AQG04-Fx6KhI3/preview' },
        { title: 'PDE-L-3-CH-2-Type-1-Langrange-PDE-Part-1', url: 'https://drive.google.com/file/d/1pSQgPfVvpIIO7_JOQ5ndPJC3ROb-qqgZ/preview' },
        { title: 'PDE-L-6-CH-3-Type-2-Charpit Method', url: 'https://drive.google.com/file/d/1OEDT4STTjzPwOLiGnae8oq9RdAc_GNu0/preview' },
        { title: 'PDE-L-7-CH-4-Type-1&2-Classification of PDE & homogeneous PDEs', url: 'https://drive.google.com/file/d/1GlgRnKnh2TmEX4cNEVfNKCMPtX68QTDK/preview' },
        { title: 'PDE-L-8-CH-4-Type-3-Homogeneous F(D,D")=f(x,y)', url: 'https://drive.google.com/file/d/1S2AN-Y9k1Dry9Q6qof0coWBp_lyQe6C1/preview' },
      ]
    };
    const agniData = {
      title: 'Unit 4 - AGNI 3.0',
      description: 'Complete Unit 4 preparation for AGNI 3.0 with advanced lectures and resources.',
      price: 12,
      originalPrice: 2499,
      duration: '30 Days Access',
      category: 'AGNI 3.0',
      image: '',
      videos: [
        { title: 'L-1-Unit-4-Part-1-DENM-NA-CH-7-Topic-1-Solution by Regula Falsi Method', videoId: 'PPNTydP5mc0', duration: '2:05:10 min', isFree: true, isLocked: false, order: 1 },
        { title: 'L-2-Unit-4-Part-2-DENM-NA-CH-7-Topic-2-Solution by Newton Raphson Method', videoId: 'mmeE1UwjDfM', duration: '1:23:58 min', isFree: false, isLocked: true, order: 2 },
        { title: 'L-3-Unit-4-Part-2-DENM-NA-CH-7-Topic-4-Solution by Bisection Method', videoId: 'p4ezUgYyFKI', duration: '53:05 min', isFree: false, isLocked: true, order: 3 },
        { title: 'L-4-Unit-4-Part-4-DENM-NA-CH-4-Topic-4-Bessel Interpolation Formula', videoId: 'AgAhLolUI9M', duration: '50:21 min', isFree: false, isLocked: true, order: 4 },
        { title: 'L-5-Unit-4-Part-1-DENM-NA-CH-4-Topic-4 +++Bessel Interpolation Formula', videoId: '6r3gWkxSnXQ', duration: '19:17 min', isFree: false, isLocked: true, order: 5 },
      ],
      pdfs: [
        { title: 'L-1-Unit-4-Part-1-DENM-NA-CH-7-Topic-1-Solution by Regula Falsi Method', url: 'https://drive.google.com/file/d/1l623J9L7PBu03F5WTab2sLu1I6VzFaYt/preview' },
        { title: 'L-2-Unit-4-Part-2-DENM-NA-CH-7-Topic-2-Solution by Newton Raphson Method', url: 'https://drive.google.com/file/d/1HEca0-3D_Csdf6t__7fpVhDLlaV9FbUA/preview' },
        { title: 'L-3-Unit-4-Part-2-DENM-NA-CH-7-Topic-4-Solution by Bisection Method', url: 'https://drive.google.com/file/d/1qfHR-OaZ7nYGl5yOv3w6jo6EPxr5mlh4/preview' },
        { title: 'L-4&5-Unit-4-Part-4-DENM-NA-CH-4-Topic-4-Bessel Interpolation Formula', url: 'https://drive.google.com/file/d/1aaDcNXrbGeKLUzDF-feVB3VYKCYzKhOu/preview' },
      ]
    };
    const brahmastraData = {
      title: 'Unit 5 - BRAHMASTRA 3.0',
      description: 'Complete Unit 5 preparation for BRAHMASTRA 3.0 with advanced lectures and resources.',
      price: 13,
      originalPrice: 2999,
      duration: '30 Days Access',
      category: 'BRAHMASTRA 3.0',
      image: '',
      videos: [
        { title: 'L-1-Unit-5-Part-1-DENM-NA-CH-1-Topic-1-Operators in Calculas of Finite Differences', videoId: '5oqwKrdFQr8', duration: '1:35:36 min', isFree: true, isLocked: false, order: 1 },
        { title: 'L-2-Unit-5-Part-2-DENM-NA-CH-1-Topic-2-Forward Difference Table', videoId: '2GulbJj4yU4', duration: '26:28 min', isFree: false, isLocked: true, order: 2 },
        { title: 'L-3-Unit-5-Part-3-DENM-NA-CH-1-Topic-3-Polynomials of Data', videoId: 'ovBzQZi13SI', duration: '01:11:12 min', isFree: false, isLocked: true, order: 3 },
        { title: 'L-4-Unit-5-Part-4-DENM-NA-CH-1-Topic-4-Missing Term of Data', videoId: 'OJsIzBOQVW8', duration: '01:06:22 min', isFree: false, isLocked: true, order: 4 },
        { title: 'L-5-Unit-5-Part-5-DENM-NA-CH-2-Topic-1-Newton Gregory Forward Difference Interpolation Formula', videoId: '95NTsUNKps0', duration: '01:45:20 min', isFree: false, isLocked: true, order: 5 },
        { title: 'L-6-Unit-5-Part-6-DENM-NA-CH-2-Topic-2-Newton Gregory Backward Difference Interpolation Formula', videoId: 'TmsusLaGv98', duration: '1:22:11 min', isFree: false, isLocked: true, order: 6 },
        { title: 'L-7-Unit-5-Part-7-DENM-NA-CH-3-Topic-1-Table for Divided Difference Operator', videoId: 'ONz5jPffxac', duration: '49:06 min', isFree: false, isLocked: true, order: 7 },
        { title: 'L-8-Unit-5-Part-8-DENM-NA-CH-3-Topic-2-Newtons Divided Difference Formula', videoId: '39EYjyrZFMg', duration: '1:00:24 min', isFree: false, isLocked: true, order: 8 },
        { title: 'L-9-Unit-5-Part-9-DENM-NA-CH-3-Topic-3-Langrange Formula', videoId: 'boNFjL_ph_c', duration: '02:31:52 min', isFree: false, isLocked: true, order: 9 },
        { title: 'L-10-Unit-5-Part-10-DENM-NA-CH-4-Topic-1-Central Difference and Mean Operators', videoId: 'vX5xXh-pJEU', duration: '37:24 min', isFree: false, isLocked: true, order: 10 },
        { title: 'L-11-Unit-5-Part-11-DENM-NA-CH-4-Topic-2-Gauss Forward Interpolation Formula', videoId: 'cYh5wpUTwaY', duration: '44:20 min', isFree: false, isLocked: true, order: 11 },
        { title: 'L-12-Unit-5-Part-1-DENM-NA-CH-4-Topic-3-Gauss Backward Interpolation Formula', videoId: 'e5uP6Q-hP7s', duration: '44:30 min', isFree: false, isLocked: true, order: 12 },
      ],
      pdfs: [
        { title: 'L-1-Unit-5-Part-1-DENM-NA-CH-1-Topic-1-Operators in Calculas of Finite Differences', url: 'https://drive.google.com/file/d/10UevPa-jGRLde-1xGlhZg2EjkLTWWzTf/preview' },
        { title: 'L-2-Unit-5-Part-2-DENM-NA-CH-1-Topic-2-Forward Difference Table', url: 'https://drive.google.com/file/d/1ywbmWcbsDMdoYkHHXeOw6nWLBgDncMWg/preview' },
        { title: 'L-3-Unit-5-Part-3-DENM-NA-CH-1-Topic-3-Polynomials of Data', url: 'https://drive.google.com/file/d/1_G0G3L33sYiPmQ7jJSEOTCc9hi-zcNQs/preview' },
        { title: 'L-4-Unit-5-Part-4-DENM-NA-CH-1-Topic-4-Missing Term of Data', url: 'https://drive.google.com/file/d/1fhRpT58__ckynO6lqsIzNWWzPuFknR-n/preview' },
        { title: 'L-5-Unit-5-Part-5-DENM-NA-CH-2-Topic-1-Newton Gregory Forward Difference Interpolation Formula', url: 'https://drive.google.com/file/d/1gwe6krwDE6Y4YTZLTpzWVwtxfULOUrjE/preview' },
        { title: 'L-6-Unit-5-Part-6-DENM-NA-CH-2-Topic-2-Newton Gregory Backward Difference Interpolation Formula', url: 'https://drive.google.com/file/d/10KZCbYBzMzNqNjHsz1lyN5cHr_fOd_fE/preview' },
        { title: 'L-7-Unit-5-Part-7-DENM-NA-CH-3-Topic-1-Table for Divided Difference Operator', url: 'https://drive.google.com/file/d/1g0cfHsHy8bEpd3WrYXZDCukM2D_10F0J/preview' },
        { title: 'L-8-Unit-5-Part-8-DENM-NA-CH-3-Topic-2-Newtons Divided Difference Formula', url: 'https://drive.google.com/file/d/1huavNXLNovyzZn4265PN7sV_nE6MfIYT/preview' },
        { title: 'L-9-Unit-5-Part-9-DENM-NA-CH-3-Topic-3-Langrange Formula', url: 'https://drive.google.com/file/d/1oCzOk4AAvw85zPzaYwxD7xcWBtI_V6L2/preview' },
        { title: 'L-10-Unit-5-Part-10-DENM-NA-CH-4-Topic-1-Central Difference and Mean Operators', url: 'https://drive.google.com/file/d/1v9DgKHdwrYvG_NQHQb2S0iz-1WtkbGfe/preview' },
        { title: 'L-11-Unit-5-Part-11-DENM-NA-CH-4-Topic-2-Gauss Forward Interpolation Formula', url: 'https://drive.google.com/file/d/1PsN2F7pOKILZoPOxcuggqclLczWXX1WS/preview' },
        { title: 'L-12-Unit-5-Part-12-DENM-NA-CH-4-Topic-3-Gauss Backward Interpolation Formula', url: 'https://drive.google.com/file/d/1bS_zmYWSEAoYIOe8Af6TqaiKsz-KB-QW/preview' },
      ]
    };

    // Use a more surgical update to keep old IDs if possible, or just delete and recreate as per the route logic
    // console.log('Deleting old courses...');
    // We NO LONGER delete because it changes IDs and breaks enrollments.
    // await Course.deleteMany({ title: { $nin: [arjunaData.title, dronaData.title] } });

    console.log('Upserting ARJUNA 3.0...');
    await Course.findOneAndUpdate({ title: arjunaData.title }, arjunaData, { upsert: true, new: true });

    console.log('Upserting DRONA 3.0...');
    await Course.findOneAndUpdate({ title: dronaData.title }, dronaData, { upsert: true, new: true });

    console.log('Upserting AGNI 3.0...');
    await Course.findOneAndUpdate({ title: agniData.title }, agniData, { upsert: true, new: true });

    console.log('Upserting BRAHMASTRA 3.0...');
    await Course.findOneAndUpdate({ title: brahmastraData.title }, brahmastraData, { upsert: true, new: true });

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
