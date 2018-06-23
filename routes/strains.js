const express = require('express');
const router = express.Router({mergeParams: true});
const Dispensary = require('../models/Dispensary');
const Strain = require('../models/Strain');

// New strain page
router.get('/new', (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strains/new', {dispensary: dispensary});
    }
  });
});

// New strain logic
router.post('/', (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
      res.redirect('/dispensaries');
    } else {
      Strain.create({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        image: req.body.image
      }, (err, strain) => {
        if(err) {
          console.log(err.message);
          return res.redirect('back');
        }
        strain.save();
        dispensary.strains.push(strain._id);
        dispensary.save();
        console.log('Strain added to db: ', strain);
        res.redirect('/');
      });
    }
  });
});

// Strain show page
router.get('/:id', (req, res) => {
  Strain.findById(req.params.id).populate('reviews').exec((err, strain) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strains/show', {strain: strain});
    }
  });
});

// Strain edit page
router.get('/:id/edit', (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strains/edit', {dispensary_id: req.params.id, strain: strain});
    }
  });
});

// Strain edit logic
router.put('/:id', (req, res) => {
  Strain.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    image: req.body.image
  }, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Strain updated: ', strain);
      res.redirect('back');
    }
  });
});

// Strain delete logic
router.delete('/:id', (req, res) => {
  
});

module.exports = router;