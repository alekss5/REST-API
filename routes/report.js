const Quiz = require("../models/quizSchema");
const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/userSchema");


const ObjectId = mongoose.Types.ObjectId;


// CREATE REPORT BY USEREMAIL
router.post("/create", async (req, res) => {
    try {
        const userEmail = req.body.userEmail;
        const reportData = req.body; 
        console.log(reportData)
        const user = await User.findOne({ email: userEmail });
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        user.reports.push(reportData);
        await user.save();
    
        res.status(200).json({ message: "Report is saved successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
  });

   // GET The reports to the notifications
  router.get('/getReports', async (req, res) => {
    try {
      const userEmail = req.query.email;
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const reports = user.reports
      res.status(200).json(reports);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
  });
  router.put("/markAsRead/:notificationId", async (req, res) => {
    const notificationId = req.params.notificationId;
    const userEmail = req.query.email; // Get the user's email from the query parameter
  
    try {
      // Find the user by email (assuming you have a logged-in user)
      const user = await User.findOne({ email: userEmail });
  
      console.log(notificationId)
      // Find the notification with the given ID in the user's notifications array
      const notification = user.reports.find(
        (n) => n._id.toString() === notificationId
      );
  
      // if (!notification) {
      //   return res.status(404).json({ message: "Notification not found" });
      // }
  
      // Mark the notification as read
       notification.readed = true;
  
      // Save the user with the updated notification
      await user.save();
  
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  module.exports = router;
  //GET QIOZ ID,NAME,TIME,GOBACK
//   router.get('/Ids', async (req, res) => {
//     try {
//         const userEmail = req.query.email;
//       const user = await User.findOne({ email: userEmail });

//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
//       const userQuizIds = user.quizIds
//       const QUIZES =  await Quiz.find({ _id: { $in: userQuizIds } }, { _id: 1, quizName: 1, time: 1, goBack: 1 }) 
//      res.send(QUIZES)
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Failed to fetch quiz data' });
//     }
//   });

// //GET QIOZ ID,NAME,TIME,GOBACK
//   router.get('/list', async (req, res) => {
//     try {
//       const data = await Quiz.find({}, { _id: 1, quizName: 1, time: 1, goBack: 1 });
//       res.send(data);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Failed to fetch quiz data' });
//     }
//   });

// //GET QUIZ DATA
//   router.get('/:id', async (req, res) => {
//     try {
//       const quizId = req.params.id;
     
  
//       const quiz = await Quiz.findById(quizId, { order: 1 });
  
//       console.log(quiz)
//       if (!quiz.order) {
//         const quiz = await Quiz.aggregate([
//           { $match: { _id: new ObjectId(quizId) } },
//           { $project: { quizCreatorEmail: 1,questions: 1, quizName: 1, order: 1, time: 1, goBack: 1 } },
//           { $unwind: '$questions' },
//           { $sample: { size: 5 } },
//           {
//             $group: {
//               _id: '$_id',
//               quizCreatorEmail: { $first:'$quizCreatorEmail' },
//               quizName: { $first: '$quizName' },
//               order: { $first: '$order' },
//               time: { $first: '$time' },
//               goBack: { $first: '$goBack' },
//               questions: { $push: '$questions' }
//             }
//           }
//         ]);
  
//         res.status(200).json(quiz[0]);
//       } else {
//         const quiz = await Quiz.findById(quizId);
//         console.log(quiz);
//         const { quizCreatorEmail,quizName, order, time, goBack, questions } = quiz;
  
//         res.status(200).json({ quizCreatorEmail,quizName, order, time, goBack, questions });
//       }
  
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
//   //DELETE QUIZ BY ID
//   router.delete('/delete/:id', async (req, res) => {
//     try {
//       const quizId = req.params.id;
  
//       const deleted = await Quiz.deleteOne({ _id: quizId });
  
//       if (deleted.deletedCount === 0) {
//         return res.status(404).send({ message: 'Quiz not found' });
//       }
  
//       res.status(200).send({ message: 'Quiz deleted successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

//   // GET QUIZ BY ID
//   router.get('/edit/:id', async (req, res) => {
//     try {
//       const quizId = req.params.id;
      
//       const quiz = await Quiz.findById(quizId);
      
//       if (!quiz) {
//         return res.status(404).json({ message: 'Quiz not found' });
//       }
      
//       res.status(200).json(quiz);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
// //UPDATE QUIZ BY ID
//   router.post('/update/:id', async (req, res) => {
//     try {
//       const { quizName, order, time, goBack, questions } = req.body;
//       const quizId = req.params.id;
  
//       const update = {
//         quizName,
//         order,
//         time,
//         goBack,
//         questions
//       };
  
//       const quiz = await Quiz.findByIdAndUpdate(quizId, update);
      
//       if (!quiz) {
//         return res.status(404).json({ success: false, message: 'Quiz not found' });
//       }
      
//       res.status(200).json({ success: true, message: 'Quiz updated successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   });


