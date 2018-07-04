const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dispensary = require('../models/Dispensary');
const Strain = require('../models/Strain');

// Landing page
router.get('/', (req, res) => {
  Dispensary.find({}, (err, dispensaries) => {
    if(err) {
      console.log(err);
    } else { 
      Strain.find({}, (err, strains) => {
        if(err) {
          console.log(err);
        } else {
          res.render('index', {dispensaries: dispensaries, strains: strains, session: req.session});
        }
      });
    }
  });
});

module.exports = router;