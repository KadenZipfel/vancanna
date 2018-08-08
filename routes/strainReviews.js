const express = require('express');
const router = express.Router({mergeParams: true});
const Strain = require('../models/Strain');
const Dispensary = require('../models/Dispensary');
const Review = require('../models/Review');
const User = require('../models/User');
const middleware = require('../middleware');

// New strain review page
router.get('/reviews/new', middleware.isLoggedIn, (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      Dispensary.findById(strain.dispensary, (err, dispensary) => {
        if(err) {
          console.log(err);
        } else {
          res.render('strainReviews/new', {dispensary: dispensary, 
            strain: strain, user: req.user});
        }
      });
    }
  }); 
});

// New strain review logic
router.post('/reviews', middleware.isLoggedIn, (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      Review.create({
        text: req.body.text,
        rating: req.body.rating,
        flavors: req.body.flavors,
        effects: req.body.effects
      }, (err, review) => {
        if(err) {
          console.log(err);
        } else {
          if(!req.user.points) {
            req.user.points = 10;
          } else {
            req.user.points += 10;
          }
          req.user.save();
          review.author.id = req.user._id;
          review.author.username = req.user.username;
          review.save();
          strain.reviews.push(review._id);
          strain.save();
          res.redirect('/dispensaries');
        }
      });
    }
  }); 
});

// Edit strain review page
router.get('/reviews/:id/edit', middleware.checkReviewOwnership, (req, res) => {
  Review.findById(req.params.id, (err, review) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strainReviews/edit', {dispensary_id: req.params.id, strain_id: req.params.id, review: review, user: req.user});
    }
  });
});

// Edit strain review logic
router.put('/reviews/:id', middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndUpdate(req.params.id, {
    text: req.body.text,
    rating: req.body.rating,
    flavors: req.body.flavors,
    effects: req.body.effects
  }, (err, review) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Review updated: ', review);
      res.redirect('/dispensaries');
    }
  });
});

// Delete strain review logic
router.delete('/reviews/:id', middleware.checkReviewOwnership, (req, res) => {
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