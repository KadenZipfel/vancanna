const express = require('express');
const router = express.Router();
const Dispensary = require('../models/Dispensary');

// Dispensaries index
router.get('/', (req, res) => {
  Dispensary.find({}, (err, dispensaries) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/index', {dispensaries: dispensaries});
    }
  });
});

// New dispensary page
router.get('/new', (req, res) => {
  res.render('dispensaries/new');
});

// New dispensary logic
router.post('/', (req, res) => {
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
    console.log('Dispensary added to db: ', dispensary);
    res.redirect('/dispensaries');
  });
});

// Dispensary show page
router.get('/:id', (req, res) => {
  Dispensary.findById(req.params.id).populate('strains').populate('reviews').exec((err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/show', {dispensary: dispensary});
    }
  });
});

// Edit dispensary page
router.get('/:id/edit', (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/edit', {dispensary: dispensary});
    }
  });
});

// Edit dispensary logic
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  Dispensary.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/dispensaries');
    }
  });
});

module.exports = router;