const express = require('express');
const router = express.Router();
const Dispensary = require('../models/Dispensary');
const middleware = require('../middleware');
const User = require('../models/User');
const sortBy = require('sort-by');
const keys = require('../config/keys');
const multer = require('multer');
const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: keys.geocoder.api_key,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  // Accept image files only
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are accepted'), false);
  }
  cb(null, true);
};
const upload = multer({storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'kzipfel',
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
});

// Dispensaries index
router.get('/', (req, res) => {
  Dispensary.find({}, (err, dispensaries) => {
    if(err) {
      console.log(err);
    } else {
      dispensaries.sort(sortBy('avgRating')).reverse();
      res.render('dispensaries/index', {dispensaries: dispensaries, user: req.user});
    }
  });
});

// New dispensary page
router.get('/new', middleware.isAdmin, (req, res) => {
  res.render('dispensaries/new', {user: req.user});
});

// New dispensary logic
router.post('/', middleware.isAdmin, upload.single('image'), (req, res) => {
  // Setup geocoder
  geocoder.geocode(req.body.location, (err, data) => {
    if(err || !data.length) {
      console.log(err);
      res.redirect('back');
    } else {
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      const location = data[0].formattedAddress;
      // Setup cloudinary
      cloudinary.uploader.upload(req.file.path, (result) => {
        // Add cloudinary url for image to dispensary object
        req.body.image = result.secure_url;
        Dispensary.create({
          name: req.body.name,
          location: req.body.location,
          description: req.body.description,
          image: req.body.image,
          lat: lat,
          lng: lng
        }, (err, dispensary) => {
          if(err) {
            console.log(err.message);
            return res.redirect('back');
          }
          dispensary.author.id = req.user._id;
          dispensary.author.username = req.user.username;
          dispensary.save();
          console.log('Dispensary added to db: ', dispensary);
          res.redirect('/dispensaries/' + dispensary._id);
        });
      });
    }
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

      let total = 0;
      for(var i = 0; i < dispensary.reviews.length; i++) {
        total += dispensary.reviews[i].rating;
      }
      const avgRating = total / dispensary.reviews.length;
      dispensary.avgRating = avgRating;
      dispensary.save();

      res.render('dispensaries/show', {
        dispensary: dispensary, 
        strain_id: req.params.id,
        user: req.user
      });
    }
  });
});

// Fav dispensary logic
router.get('/:id/fav', middleware.isLoggedIn, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      if(req.user) {
        if(req.user.favDispensaries.indexOf(dispensary._id) == -1){
          req.user.favDispensaries.push(dispensary._id);
          req.user.save();
        } else {
          const index = req.user.favDispensaries.indexOf(dispensary._id);
          req.user.favDispensaries.splice(index, 1);
          req.user.save();
        }
      }
      res.redirect('back');
    }
  });
});

// Edit dispensary page
router.get('/:id/edit', middleware.checkDispensaryOwnership, (req, res) => {
  Dispensary.findById(req.params.id, (err, dispensary) => {
    if(err) {
      console.log(err);
    } else {
      res.render('dispensaries/edit', {dispensary: dispensary, user: req.user});
    }
  });
});

// Edit dispensary logic
router.put('/:id', middleware.checkDispensaryOwnership, (req, res) => {
  // Setup geocoder
  geocoder.geocode(req.body.location, (err, data) => {
    if(err || !data.length) {
      console.log(err);
      res.redirect('back');
    } else {
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      const location = data[0].formattedAddress;
      Dispensary.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        image: req.body.image,
        lat: lat,
        lng: lng
      }, (err, dispensary) => {
        if(err){
          console.log(err);
          res.redirect('/dispensaries');
        } else {
          res.redirect('/dispensaries/' + dispensary._id);
        }
      });
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