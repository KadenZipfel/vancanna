const express = require('express');
const router = express.Router({mergeParams: true});
const Strain = require('../models/Strain');
const Dispensary = require('../models/Dispensary');
const Review = require('../models/Review');


// STRAIN REVIEWS

// New strain review page
router.get('/reviews/new', (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strainReviews/new', {dispensary_id: req.params.id, strain: strain});
    }
  }); 
});

// New strain review logic
router.post('/reviews', (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      Review.create({
        text: req.body.text,
        rating: req.body.rating
      }, (err, review) => {
        if(err) {
          console.log(err);
        } else {
          // Add author later
          review.save();
          strain.reviews.push(review._id);
          strain.save();
          res.redirect('back');
        }
      });
    }
  }); 
});

// Edit strain review page
router.get('/reviews/:id/edit', (req, res) => {
  res.render('strainReviews/edit');
});

// Edit strain review logic
router.put('/reviews/:id', (req, res) => {
  
});

// Delete strain review logic
router.delete('/reviews/:id', (req, res) => {

});

module.exports = router;