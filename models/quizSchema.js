const mongoose = require('mongoose');


const QuizSchema = new mongoose.Schema({
  quizCreatorEmail:String,
  quizName: String,
  order: Boolean,
  time: String,
  goBack: Boolean,
  firstInput:String,
  SecondInput:String,
  questions: [{
    question: String,
    options: [String],
    answer: mongoose.Schema.Types.Mixed
  }]
});

const Quiz = mongoose.model('Quiz', QuizSchema);


module.exports = Quiz;
