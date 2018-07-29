const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dispensary = require('../models/Dispensary');
const middleware = require('../middleware');
const passport       = require('passport');
const LocalStrategy  = require('passport-local');

// Login page
router.get('/login', (req, res) => {
  res.render('users/login', {user: req.user});
});

// Login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), (req, res) => {
});

// Logout logic
router.get('/logout', middleware.isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

// Sign up page
router.get('/signup', (req, res) => {
  res.render('users/signup', {user: req.user});
});

// Sign up logic
router.post('/signup', (req, res) => {
  User.register(
    new User({
      email: req.body.email, 
      username: req.body.username
    }), req.body.password, (err, user) => {
      if(err) {
        console.log(err);
        return res.render('users/signup');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      });
      console.log(user);
  });
});

// Profile Page
router.get('/profile', middleware.isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .populate('favDispensaries')
    .populate('favStrains')
    .exec((err, user) => {
      if(err) {
        console.log(err);
      } else {
        res.render('users/profile', {user: user});
      }
    });
});

// ADMIN ROUTES
// ------------

// Admin Page
router.get('/admin', middleware.isLoggedIn, (req, res) => {
  res.render('users/admin', {user: req.user});
});

// Admin Logic
router.post('/admin', middleware.isLoggedIn, (req, res) => {
  // Move secret later
  if(req.body.secret == 'high') {
    req.user.admin = true;
    req.user.save();
    console.log('Successfully added as admin')
    res.redirect('/');
  } else {
    console.log('Secret is incorrect, please try again.');
    res.redirect('back');
  }
});

// MODERATOR ROUTES
// ----------------

// Moderator Page
router.get('/moderator', middleware.isLoggedIn, (req, res) => {
  res.render('users/moderator', {user: req.user});
});

// Moderator Logic
router.post('/moderator', middleware.isLoggedIn, (req, res) => {
  // Move secret later
  if(req.body.secret == 'highmod') {
    req.user.moderator = true;
    req.user.save();
    console.log('Successfully added as moderator')
    res.redirect('/');
  } else {
    console.log('Secret is incorrect, please try again.');
    res.redirect('back');
  }
});


module.exports = router;