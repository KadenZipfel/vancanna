const mongoose = require('mongoose');

const dispensarySchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  strains: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strain'
  },
  reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
});

module.exports = mongoose.model('Dispensary', dispensarySchema);