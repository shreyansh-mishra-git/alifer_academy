const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });
const Course = require('./models/Course');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const arjuna3 = await Course.findOne({ title: /ARJUNA 3\.0/i });
    if (!arjuna3) {
      console.error('❌ ARJUNA 3.0 not found in database');
      process.exit(1);
    }

    console.log(`✅ Found ARJUNA 3.0 (ID: ${arjuna3._id})`);
    console.log(`   Videos: ${arjuna3.videos.length}`);
    arjuna3.videos.forEach((v, i) => {
      console.log(`   ${i + 1}. [${v.videoId}] ${v.title} (${v.duration}) free=${v.isFree}`);
    });
    console.log(`   PDFs: ${arjuna3.pdfs?.length || 0}`);

    // Copy videos and PDFs from 3.0 to 4.0
    const result = await Course.findOneAndUpdate(
      { title: /ARJUNA 4\.0/i },
      {
        $set: {
          videos: arjuna3.videos.map(v => ({
            title: v.title,
            videoId: v.videoId,
            duration: v.duration,
            isFree: v.isFree,
            isLocked: v.isLocked,
            order: v.order,
          })),
          pdfs: (arjuna3.pdfs || []).map(p => ({
            title: p.title,
            url: p.url,
          })),
        }
      },
      { new: true }
    );

    if (!result) {
      console.error('❌ ARJUNA 4.0 not found in database. Creating it...');
      // Create Arjuna 4.0 as a clone of 3.0
      const newCourse = new Course({
        title: 'Unit 1 - ARJUNA 4.0',
        description: 'The latest ARJUNA 4.0 batch for Unit 1. Enrollment is now open!',
        price: arjuna3.price,
        originalPrice: arjuna3.originalPrice,
        duration: arjuna3.duration,
        category: 'ARJUNA 4.0',
        image: '',
        isActive: true,
        videos: arjuna3.videos,
        pdfs: arjuna3.pdfs,
      });
      await newCourse.save();
      console.log(`✅ Created ARJUNA 4.0 (ID: ${newCourse._id})`);
    } else {
      console.log(`\n✅ Updated ARJUNA 4.0 (ID: ${result._id})`);
      console.log(`   Now has ${result.videos.length} videos and ${result.pdfs?.length || 0} PDFs`);
      result.videos.forEach((v, i) => {
        console.log(`   ${i + 1}. [${v.videoId}] ${v.title}`);
      });
    }

    console.log('\n🎉 Done! Arjuna 4.0 now has the same videos as Arjuna 3.0.');
    process.exit();
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
};

run();
