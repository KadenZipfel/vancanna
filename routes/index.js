const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Landing page
router.get('/', (req, res) => {
  res.render('index', {session: req.session});
});

module.exports = router;