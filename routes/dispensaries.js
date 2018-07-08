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
      User.findById(req.session.userId, (err, user) => {
        if(err) {
          console.log(err);
        } else {
          res.render('dispensaries/index', {dispensaries: dispensaries, user: user, session: req.session});
        }
      });
    }
  });
});

// New dispensary page
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('dispensaries/new', {session: req.session});
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
    User.findById(req.session.userId, (err, user) => {
      if(err) {
        console.log(err);
      } else {
        dispensary.author.id = user._id;
        dispensary.author.username = user.username;
        dispensary.save();
      }
    });
    console.log('Dispensary added to db: ', dispensary);
    res.redirect('/dispensaries');
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
      User.findById(req.session.userId, (err, user) => {
        if(err) {
          console.log(err);
        } else {
          res.render('dispensaries/show', {
            dispensary: dispensary, 
            user: user,
            strain_id: req.params.id,
            session: req.session
          });
        }
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
      res.render('dispensaries/edit', {dispensary: dispensary, session: req.session});
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
      res.redirect('/dispensaries/' + req.params.id);
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