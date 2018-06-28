const express = require('express');
const router = express.Router({mergeParams: true});
const Dispensary = require('../models/Dispensary');
const Review = require('../models/Review');

// DISPENSARY REVIEWS

// New dispensary review page
router.get('/reviews/new', (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaryReviews/new', {dispensary: dispensary});
    }
  });
});

// New dispensary review logic
router.post('/reviews', (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
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
          dispensary.reviews.push(review._id);
          dispensary.save();
          res.redirect('/dispensaries/' + dispensary._id);
        }
      });
    }
  });
});

// Edit dispensary review page
router.get('/reviews/:id/edit', (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaryReviews/edit', {dispensary_id: req.params.id, review: review});
    }
  });
});

// Edit dispensary review logic
router.put('/reviews/:id', (req, res) => {
  Review.findByIdAndUpdate(req.params.id, {
    text: req.body.text,
    rating: req.body.rating
  },(err, review) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Review updated: ', review);
      res.redirect('back');
    }
  });
});

// Delete dispensary review logic
router.delete('/reviews/:id', (req, res) => {
  Review.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      console.log(err);
    } else {
      // Redirect somewhere better later
      res.redirect('/dispensaries');
    }
  });
});

module.exports = router;