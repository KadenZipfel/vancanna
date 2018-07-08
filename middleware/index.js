let middlewareObj = {};
const Dispensary = require('../models/Dispensary');
const Review = require('../models/Review');
const Strain = require('../models/Strain');
const User = require('../models/User');

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.session.userId) {
    return next();
  }
  console.log('User not logged in');
  res.redirect('/login');
}

middlewareObj.isAdmin = (req, res, next) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      if(req.session.userId && user.moderator == true) {
        return next();
      } else {
        User.findById(req.session.userId, (err, user) => {
          if(req.session.userId && user.admin == true) {
            return next();
          } 
          console.log('You must be an admin to do that.');
          res.redirect('back');
        });
      }
    }
  });
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      if(req.session.userId && user.moderator == true) {
        return next();
      } else {
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
    }
  });
}

middlewareObj.checkDispensaryOwnership = (req, res, next) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      if(req.session.userId && user.moderator == true) {
        return next();
      } else {
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
    }
  });
}

middlewareObj.checkStrainOwnership = (req, res, next) => {
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      if(req.session.userId && user.moderator == true) {
        return next();
      } else {
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
    }
  });
}



module.exports = middlewareObj;