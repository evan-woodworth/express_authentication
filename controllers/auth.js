const express = require('express');
const router = express.Router();
const passport = require('../config/ppConfig');
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back...',
  failureFlash: 'Either email or password is incorrect'
}));

router.post('/signup', async (req,res)=>{
  const {name, email, password} = req.body;

  try {
    const [user, created] = await db.user.findOrCreate({
      where: {email},
      defaults: { name, password }
    });

    if (created) {
      console.log(`------ ${user.name} was created ------`);
      const successObject = {
        successRedirect: '/',
        successFlash: `Welcome ${user.name}. Account was created.`
      }

      passport.authenticate('local', successObject)(req,res);
    } else {
      //send back email already exists
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  } catch (error) {
    console.log('------- Error below -----------');
    console.log(error);
    //handle the user
    req.flash('error', 'Email or password is incorrect. Please try again.');
    res.redirect('/auth/signup');
  }
})

module.exports = router;
