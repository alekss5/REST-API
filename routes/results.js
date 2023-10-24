const Quiz = require("../models/quizSchema");
const router = require("express").Router();
const mongoose = require("mongoose");
const Result = require("../models/resultSchema");



const ObjectId = mongoose.Types.ObjectId;


// CREATE REPORT BY USEREMAIL
router.post("/create", async (req, res) => {
    try {
        const result = new Result(req.body);
        await result.save();
    
        res.status(200).json({ message: "Result saved successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
  });
  router.get("/getById", async (req, res) => {
    try {
     
const quizIdToMatch = '650058ed1eabc2cf5a0c9bcc'; // The quizId you want to match

// Find all documents where quizId matches the specified value
 const results = Result.find({ quizId: quizIdToMatch }, (err, documents) => {
  if (err) {
    console.error('Error finding documents:', err);
    return;
  }

  if (documents.length > 0) {
   res.send(documents);
  } else {
    res.status(404).json({ message:"No results found"});
  }
})


    }catch (err) {
      console.error(err);
      res.status(500).json({ message:"Error"});
    }


  })

   // GET The reports to the notifications
//   router.get('/getReports', async (req, res) => {
//     try {
//       const userEmail = req.query.email;
//       const user = await User.findOne({ email: userEmail });

//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
//       const reports = user.reports
//       res.status(200).json(reports);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Failed to fetch reports' });
//     }
//   });
//   router.put("/markAsRead/:notificationId", async (req, res) => {
//     const notificationId = req.params.notificationId;
//     const userEmail = req.query.email; // Get the user's email from the query parameter
  
//     try {
//       // Find the user by email (assuming you have a logged-in user)
//       const user = await User.findOne({ email: userEmail });
  
//       console.log(notificationId)
//       // Find the notification with the given ID in the user's notifications array
//       const notification = user.reports.find(
//         (n) => n._id.toString() === notificationId
//       );
  
//       // if (!notification) {
//       //   return res.status(404).json({ message: "Notification not found" });
//       // }
  
//       // Mark the notification as read
//        notification.readed = true;
  
//       // Save the user with the updated notification
//       await user.save();
  
//       res.status(200).json({ message: "Notification marked as read" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });

  module.exports = router;