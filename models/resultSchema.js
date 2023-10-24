const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },

  quizId:{
    type: String,
    required: true,
  },
  time:{
    type: String,
    required: true,
  },
  points:{
    type: String,
    required:true,
  },
  totalPoints: {
    type: String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
