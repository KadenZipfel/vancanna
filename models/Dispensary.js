const mongoose = require('mongoose');

const dispensarySchema = new mongoose.Schema({
  name: String,
  location: String,
  lat: Number,
  lng: Number,
  description: String,
  image: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  strains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strain'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  avgRating: {
    type: Number, 
    default: 0
  }
});

var Dispensary = mongoose.model('Dispensary', dispensarySchema);
module.exports = Dispensary;