const express = require('express');
const router = express.Router();
const User = require('../models/User');
const middleware = require('../middleware');

// Login page
router.get('/login', (req, res) => {
  res.render('users/login', {session: req.session});
});

// Login logic
router.post('/login', (req, res) => {
  User.authenticate(req.body.username, req.body.password, (error, user) => {
    if(error || !user) {
      var err = new Error('Wrong username or password.');
      err.status = 401;
      return console.log(err);
    } else {
      req.session.userId = user._id;
      console.log(`Logged in with user id: ${req.session.userId}`);
      return res.redirect('/');
    }
  })
});

// Logout logic
router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy((err) => {
      if(err) {
        return next(err);
      } else {
        console.log('Logged out');
        return res.redirect('/');
      }
    });
  }
});

// Sign up page
router.get('/signup', (req, res) => {
  res.render('users/signup', {session: req.session});
});

// Sign up logic
router.post('/signup', (req, res) => {
  if(req.body.email &&
    req.body.username &&
    req.body.password) {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }

    User.create(userData, (err, user) => {
      if(err) {
        return console.log(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    });
  } else {
    console.log('Could not complete your request');
    res.redirect('back');
  }
});

// Profile Page
router.get('/profile', middleware.isLoggedIn, (req, res) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      res.render('users/profile', {user: user, session: req.session});
    }
  });
});

module.exports = router;