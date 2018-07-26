const express = require('express');
const router = express.Router();
const Dispensary = require('../models/Dispensary');
const middleware = require('../middleware');
const User = require('../models/User');

// Dispensaries index
router.get('/', (req, res) => {
  Dispensary.find({}, (err, dispensaries) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/index', {dispensaries: dispensaries, user: req.user});
    }
  });
});

// New dispensary page
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('dispensaries/new', {user: req.user});
});

// New dispensary logic
router.post('/', middleware.isAdmin, (req, res) => {
  Dispensary.create({
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    image: req.body.image
  }, (err, dispensary) => {
    if(err) {
      console.log(err.message);
      return res.redirect('back');
    }
    dispensary.author.id = req.user._id;
    dispensary.author.username = req.user.username;
    dispensary.save();
    console.log('Dispensary added to db: ', dispensary);
    res.redirect('/dispensaries/' + dispensary._id);
  });
});

// Dispensary show page
router.get('/:id', (req, res) => {
  Dispensary.findById(req.params.id)
    .populate('strains')
    .populate('reviews')
    .exec((err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      let total = 0;
      for(var i = 0; i < dispensary.reviews.length; i++) {
        total += dispensary.reviews[i].rating;
      }
      const avgRating = total / dispensary.reviews.length;
      dispensary.avgRating = avgRating;
      dispensary.save();

      res.render('dispensaries/show', {
        dispensary: dispensary, 
        strain_id: req.params.id,
        user: req.user
      });
    }
  });
});

// Edit dispensary page
router.get('/:id/edit', middleware.checkDispensaryOwnership, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/edit', {dispensary: dispensary, user: req.user});
    }
  });
});

// Edit dispensary logic
router.put('/:id', middleware.checkDispensaryOwnership, (req, res) => {
  Dispensary.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    image: req.body.image
  }, (err, dispensary) => {
    if(err){
      console.log(err);
      res.redirect('/dispensaries');
    } else {
      res.redirect('/dispensaries/' + dispensary._id);
    }
  });
});

// Delete dispensary logic
router.delete('/:id', middleware.checkDispensaryOwnership, (req, res) => {
  Dispensary.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/dispensaries');
    }
  });
});

module.exports = router;