const express = require('express');
const router = express.Router();
const Dispensary = require('../models/Dispensary');

// Dispensaries index
router.get('/', (req, res) => {
  res.render('dispensaries/index');
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
  res.render('dispensaries/show');
});

// Edit dispensary page
router.get('/:id/edit', (req, res) => {
  res.render('dispensaries/edit');
});

// Edit dispensary logic
router.put('/:id', (req, res) => {
  
});

// Delete dispensary logic
router.delete('/:id', (req, res) => {

});

module.exports = router;