const mongoose = require('mongoose');

const dispensarySchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  image: String,
  strains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strain'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

var Dispensary = mongoose.model('Dispensary', dispensarySchema);
module.exports = Dispensary;