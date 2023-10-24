const Quiz = require("../models/quizSchema");
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const ObjectId = mongoose.Types.ObjectId;


//CREATE QUIZ /api/quiz/edit/:id
router.post("/create", async (req, res) => {
    const newQuiz = new Quiz(req.body);
    const userEmail = req.body.email;
    
    try {
      const savedQuiz = await newQuiz.save();
      res.status(200).json(savedQuiz);
      const user = await User.findOne({ email: userEmail });
      const quizId = savedQuiz._id;
      user.quizIds.push(quizId);

      // Save the updated user document
      await user.save();
      console.log("Quiz is saved")
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //GET QIOZ ID,NAME,TIME,GOBACK
  router.get('/Ids', async (req, res) => {
    try {
        const userEmail = req.query.email;
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const userQuizIds = user.quizIds
      const QUIZES =  await Quiz.find({ _id: { $in: userQuizIds } }, { _id: 1, quizName: 1, time: 1, goBack: 1 }) 
     res.send(QUIZES)
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch quiz data' });
    }
  });

//GET QIOZ ID,NAME,TIME,GOBACK
  router.get('/list', async (req, res) => {
    try {
      const data = await Quiz.find({}, { _id: 1, quizName: 1, time: 1, goBack: 1 });
      res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch quiz data' });
    }
  });

//GET QUIZ DATA
  router.get('/:id', async (req, res) => {
    try {
      const quizId = req.params.id;
     
  
      const quiz = await Quiz.findById(quizId, { order: 1 });
  
      console.log(quiz)
      if (!quiz.order) {
        const quiz = await Quiz.aggregate([
          { $match: { _id: new ObjectId(quizId) } },
          { $project: { quizCreatorEmail: 1,questions: 1, quizName: 1, order: 1, time: 1, goBack: 1 } },
          { $unwind: '$questions' },
          { $sample: { size: 5 } },
          {
            $group: {
              _id: '$_id',
              quizCreatorEmail: { $first:'$quizCreatorEmail' },
              quizName: { $first: '$quizName' },
              order: { $first: '$order' },
              time: { $first: '$time' },
              goBack: { $first: '$goBack' },
              questions: { $push: '$questions' }
            }
          }
        ]);
  
        res.status(200).json(quiz[0]);
      } else {
        const quiz = await Quiz.findById(quizId);
        console.log(quiz);
        const { quizCreatorEmail,quizName, order, time, goBack, questions } = quiz;
  
        res.status(200).json({ quizCreatorEmail,quizName, order, time, goBack, questions });
      }
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  //DELETE QUIZ BY ID
  router.delete('/delete/:id', async (req, res) => {
    try {
      const quizId = req.params.id;
  
      const deleted = await Quiz.deleteOne({ _id: quizId });
  
      if (deleted.deletedCount === 0) {
        return res.status(404).send({ message: 'Quiz not found' });
      }
  
      res.status(200).send({ message: 'Quiz deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // GET QUIZ BY ID
  router.get('/edit/:id', async (req, res) => {
    try {
      const quizId = req.params.id;
      
      const quiz = await Quiz.findById(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      res.status(200).json(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
//UPDATE QUIZ BY ID
  router.post('/update/:id', async (req, res) => {
    try {
      const { quizName, order, time, goBack, questions } = req.body;
      const quizId = req.params.id;
  
      const update = {
        quizName,
        order,
        time,
        goBack,
        questions
      };
  
      const quiz = await Quiz.findByIdAndUpdate(quizId, update);
      
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found' });
      }
      
      res.status(200).json({ success: true, message: 'Quiz updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


  module.exports = router;