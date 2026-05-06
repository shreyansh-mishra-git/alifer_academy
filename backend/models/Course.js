const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoId: { type: String, required: true }, // YouTube video ID only (not full URL)
  duration: { type: String, default: '' },
  isFree: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    duration: { type: String, default: '' },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    videos: [videoSchema],
    pdfs: [{
      title: { type: String, required: true },
      url: { type: String, required: true },
    }],
    isActive: { type: Boolean, default: true },
    studentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
