const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    age: {
      type: Number,
      required: false
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    enrolledCourses: [{
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      enrolledAt: { type: Date, default: Date.now },
      expiresAt: { type: Date }
    }],
    studyStreak: {
      type: Number,
      default: 0
    },
    lastStudied: {
      type: Date,
      default: null
    },
    hoursStudied: {
      type: Number,
      default: 0
    },
    completedVideos: [{ type: String }], // stores videoIds
    isAdmin: {
      type: Boolean,
      default: false
    },
    activeSessionId: {
      type: String,
      default: null
    },
    // OTP Fields
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String
    },
    otpExpiry: {
      type: Date
    },
    lastOtpSent: {
      type: Date
    },
  },
  { timestamps: true }
);

/**
 * PASSWORD HASHING MIDDLEWARE
 * This triggers every time user.save() is called.
 * The 'isModified' check is CRITICAL so we don't re-hash an 
 * already hashed password when only updating the OTP.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * HELPER METHOD
 * Compares entered password with the hashed password in DB
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);