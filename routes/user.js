// const Quiz = require("../models/quizSchema");
const User = require("../models/userSchema");
const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const stripe = require('stripe')('sk_test_z6Wgj3W5n3eYSLEKPRJ4OrE900vpjOnFhP');
// const ObjectId = mongoose.Types.ObjectId;

//REGISTER

// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
 
//   try {
//     const newUser = new User({ name, email, password });
//     const result  = await newUser.save();
//     res.status(200).json(result);
//     console.log("user is saved")
//   } catch (err) {
//     console.log(err)
//     res.status(500).json(err);
//   }

//   });
  
// //LOGIN
//   router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//   User.findOne({ email }, (err, user) => {
//     if (err) {
//       console.error('Error finding user:', err);
//       res.status(500).send('Error finding user');
//     } else if (!user) {
//       res.status(404).send('User not found');
//     } else {
     
//       if (user.password === password) {
      
//         res.status(200).send(user);
//       } else {
//         res.status(401).send('Incorrect password');
//       }
//     }
//   });
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    const result = await newUser.save();
    res.status(200).json(result);
    console.log("User is saved");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const currentTime = Date.now();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).send('Incorrect email');
      return;
    }

    // Check if the account is locked
    if (user.isAccountLocked) {
      // Implement logic to handle locked accounts
      const timeLast = (currentTime - user.lastFailedLogin) / 1000;
      if(Math.floor(timeLast<2)){
        const timeLast = Math.floor(timeLast / 60)

      }
      
      res.status(401).send(`Too many login attempts. Try again after ${timeLast} `);
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Reset failed login attempts and related fields
      user.failedLoginAttempts = 0;
      user.isAccountLocked = false;
      user.lockedUntil = null;
      await user.save();

      res.status(200).send(user);
    } else {
      // Update failed login attempts, timestamp, and lockout status
      user.failedLoginAttempts += 1;
      user.lastFailedLogin = Date.now();

      if (user.failedLoginAttempts >= 3) {
        // Lock the account for 1 hour
        user.isAccountLocked = true;
        user.lockedUntil = Date.now() + 60000; // 1 minute in milliseconds
      }

      await user.save();

      res.status(401).send('Incorrect password');
    }
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).send('Error finding user');
  }


  router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Amount in cents
        currency: 'usd', // Set currency to USD
      });
      console.log(paymentIntent);
  
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  });

  module.exports = router;