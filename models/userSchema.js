const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  planType: {
    type: String,
    default:"Free",
  },
  joyride: {
    type: Boolean,
    default: false
  },
  reports: [{
    reportType: {
      type: String,
      required: true,
    },
    quizId:{
      type: String,
      required: true,
    },
    quizName: {
      type: String,
      required: true,
    },
    questionName: {
      type: String,
      required: true,
    },
    questionIndex: {
      type: String,
      required: true,
    },
    readed:{
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  quizIds:[{type:String, default:"none"}],
  // Field to track the number of failed login attempts
  failedLoginAttempts: {
    type: Number,
    default: 0, // Initialize to 0
  },
  // Field to store the timestamp of the last failed login attempt
  lastFailedLogin: {
    type: Date,
    default: null, // Initialize to null
  },
  // Field to indicate if the account is locked
  isAccountLocked: {
    type: Boolean,
    default: false, // Initialize to false
  },
  // Field to store the timestamp until which the account is locked
  lockedUntil: {
    type: Date,
    default: null, // Initialize to null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
