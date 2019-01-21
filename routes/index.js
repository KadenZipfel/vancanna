const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dispensary = require('../models/Dispensary');
const Strain = require('../models/Strain');
const sortBy = require('sort-by');

// Landing page
router.get('/', (req, res) => {
  // Handle search query
  if(req.query.search) {
    Dispensary.find()
    Strain.find()
  } else {
    Dispensary.find({}, (err, dispensaries) => {
      if(err) {
        console.log(err);
      } else { 
        dispensaries.sort(sortBy('avgRating')).reverse();
        Strain.find({}, (err, strains) => {
          if(err) {
            console.log(err);
          } else {
            strains.sort(sortBy('avgRating')).reverse();
            res.render('index', {dispensaries: dispensaries, strains: strains, user: req.user});
          }
        });
      }
    });
  }
});

// About Page
router.get('/about', (req, res) => {
  res.render('about', {user: req.user});
});

// Strains index
router.get('/strains', (req, res) => {
  Strain.find({}, (err, strains) => {
    if(err) {
      console.log(err);
    } else {
      strains.sort(sortBy('avgRating')).reverse();
      res.render('strains/index', {strains: strains, user: req.user});
    }
  });
});

// To prevent DDOS attacks
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;