let middlewareObj = {};
const Dispensary = require('../models/Dispensary');
const Review = require('../models/Review');
const Strain = require('../models/Strain');

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.session.userId) {
    return next();
  }
  console.log('User not logged in');
  res.redirect('/login');
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
  if(req.session.userId) {
    Review.findById(req.params.id, (err, review) => {
      if(err) {
        console.log(err);
      } else {
        if(review.author.id.equals(req.session.userId)) {
          next();
        } else {
          console.log('You do not have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    console.log('You must be logged in to do that.');
    res.redirect('back');
  }
}

middlewareObj.checkDispensaryOwnership = (req, res, next) => {
  if(req.session.userId) {
    Dispensary.findById(req.params.id, (err, dispensary) => {
      if(err) {
        console.log(err);
      } else {
        if(dispensary.author.id.equals(req.session.userId)) {
          next();
        } else {
          console.log('You do not have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    console.log('You must be logged in to do that.');
    res.redirect('back');
  }
}

middlewareObj.checkStrainOwnership = (req, res, next) => {
  if(req.session.userId) {
    Strain.findById(req.params.id, (err, strain) => {
      if(err) {
        console.log(err);
      } else {
        if(strain.author.id.equals(req.session.userId)) {
          next();
        } else {
          console.log('You do not have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    console.log('You must be logged in to do that.');
    res.redirect('back');
  }
}



module.exports = middlewareObj;