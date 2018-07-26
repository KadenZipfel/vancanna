const express = require('express');
const router = express.Router({mergeParams: true});
const Dispensary = require('../models/Dispensary');
const Strain = require('../models/Strain');
const middleware = require('../middleware');
const User = require('../models/User');

// New strain page
router.get('/new', middleware.isAdmin, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strains/new', {dispensary: dispensary, user: req.user});
    }
  });
});

// New strain logic
router.post('/', middleware.isAdmin, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
      res.redirect('/dispensaries');
    } else {
      Strain.create({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        image: req.body.image,
        thcContent: req.body.thcContent,
        cbdContent: req.body.cbdContent
      }, (err, strain) => {
        if(err) {
          console.log(err.message);
          return res.redirect('back');
        }
        strain.author.id = req.user._id;
        strain.author.username = req.user.username;
        strain.save();
        strain.dispensary = dispensary;
        strain.save();
        dispensary.strains.push(strain._id);
        dispensary.save();
        console.log('Strain added to db: ', strain);
        res.redirect('/dispensaries/' + dispensary._id + '/strains/' + strain._id);
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
      let total = 0;
      for(var i = 0; i < strain.reviews.length; i++) {
        total += strain.reviews[i].rating;
      }
      const avgRating = total / strain.reviews.length;
      strain.avgRating = avgRating;
      strain.save();
      
      Dispensary.findById(strain.dispensary, (err, dispensary) => {
        if(err) {
          console.log(err);
        } else {
          Strain.find({}, (err, strains) => {
            if(err) {
              console.log(err);
            } else {
              res.render('strains/show', {
                strain: strain, 
                strains: strains,
                dispensary: dispensary,
                user: req.user
              });
            }
          });
        }
      });
    }
  });
});

// Strain edit page
router.get('/:id/edit', middleware.checkStrainOwnership, (req, res) => {
  Strain.findById(req.params.id, (err, strain) => {
    if(err) {
      console.log(err);
    } else {
      res.render('strains/edit', {dispensary_id: req.params.id, strain: strain, user: req.user});
    }
  });
});

// Strain edit logic
router.put('/:id', middleware.checkStrainOwnership, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      Strain.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        image: req.body.image,
        thcContent: req.body.thcContent,
        cbdContent: req.body.cbdContent
      }, (err, strain) => {
        if(err) {
          console.log(err);
        } else {
          console.log('Strain updated: ', strain);
          // Redirect somewhere better later
          res.redirect('/dispensaries/' + dispensary + '/strains/' + strain._id);
        }
      });
    }
  });
});

// Strain delete logic
router.delete('/:id', middleware.checkStrainOwnership, (req, res) => {
  Strain.findByIdAndRemove(req.params.id, (err) => {
    if(err) {
      console.log(err);
    } else {
      // Redirect somewhere better later
      res.redirect('/dispensaries');
    }
  });
});

module.exports = router;