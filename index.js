const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const quizRoute = require("./routes/quiz");
const userRoute = require("./routes/user");
const reportsRoute = require("./routes/report");
const resultRoute = require("./routes/results");
const User = require("./models/userSchema");



const cors = require("cors");


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


  async function resetLockedAccounts() {
    const currentDate = new Date(); 
    // cutoffDate.setHours(cutoffDate.getHours() - 1); // Example: Reset if locked more than 1 hour ago
    const twoMinutesAgo = new Date(currentDate);
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    
    const updatedUsers = await User.updateMany(
      {
        isAccountLocked: true,
        lockedUntil: { $lte: currentDate },
      },
      {
        $set: {
          isAccountLocked: false,
          failedLoginAttempts: 0, 
          lockedUntil: null,
        },
      }
    );
    const clearLoginAtempts = await User.updateMany(
      {
        lastFailedLogin: { $lte: twoMinutesAgo }, 
      },
      {
        $set: {
          failedLoginAttempts: 0, 
        },
      }
    );
  
    console.log(`Reset ${updatedUsers.nModified} locked accounts.`);
  }
  



//   const passport = require('passport');
//   const GoogleStrategy = require('passport-google-oauth20').Strategy;
//   passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_AUT,
//     clientSecret: process.env.GOOGLE_SECRET,
//     callbackURL: '/auth/google/callback' // This should match the authorized redirect URI in your Google Developers Console
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     // Check if the user already exists in the database
//     const existingUser = await User.findOne({ email: profile.emails[0].value });

//     console.log("sdfs")
//     console.log(existingUser)
    
//     if (existingUser) {
//       // User already exists, return the existing user
//       return done(null, existingUser);
//     }

//     // User doesn't exist, create a new user in the database
//     const newUser = new User({
//       email: profile.emails[0].value,
//       name: profile.displayName,
//       profilePicture: profile.photos[0].value,
//     });

//     // Save the new user to the database
//     await newUser.save();

//     return done(null, newUser);
//   }
// )
// );
  
//   // Create the Google authentication route
//   app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
//   // Create the Google authentication callback route
//   app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//       // Redirect the user to the desired page after successful registration
//       res.redirect('/dashboard');
//     }
//   );

app.use(cors());
app.use(express.json());
app.use("/api/quiz", quizRoute);
app.use("/api/user", userRoute);
app.use("/api/reports",reportsRoute);
app.use("/api/result",resultRoute);


const db = mongoose.connection;
  db.once('open', () =>{
    resetLockedAccounts();
  })
 // setInterval(resetLockedAccounts, 60000); // 60000 milliseconds = 1 min


app.listen(process.env.PORT || 4000, () => {
  console.log("Backend server is running!");
});
