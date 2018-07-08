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
router.get('/logout', middleware.isLoggedIn, (req, res, next) => {
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

// ADMIN ROUTES
// ------------

// Admin Page
router.get('/admin', middleware.isLoggedIn, (req, res) => {
  res.render('users/admin', {session: req.session});
});

// Admin Logic
router.post('/admin', middleware.isLoggedIn, (req, res) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      // Move secret later
      if(req.body.secret == 'high') {
        user.admin = true;
        user.save();
        console.log('Successfully added as admin')
        res.redirect('/');
      } else {
        console.log('Secret is incorrect, please try again.');
        res.redirect('back');
      }
    }
  });
});

// MODERATOR ROUTES
// ----------------

// Moderator Page
router.get('/moderator', middleware.isLoggedIn, (req, res) => {
  res.render('users/moderator', {session: req.session});
});

// Moderator Logic
router.post('/moderator', middleware.isLoggedIn, (req, res) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      // Move secret later
      if(req.body.secret == 'highmod') {
        user.moderator = true;
        user.save();
        console.log('Successfully added as moderator')
        res.redirect('/');
      } else {
        console.log('Secret is incorrect, please try again.');
        res.redirect('back');
      }
    }
  });
});


module.exports = router;