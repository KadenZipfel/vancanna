const express = require('express');
const router  = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Login logic
router.post('/login', (req, res) => {
  
});

// Sign up page
router.get('/signup', (req, res) => {
  res.render('users/signup');
});

// Sign up logic
router.post('/signup', (req, res) => {
  
});

module.exports = router;