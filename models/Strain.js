const mongoose = require('mongoose');

const strainSchema = new mongoose.Schema({
  name: String,
  image: String, // To be changed to array of multiple images
  type: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }, 
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  dispensary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispensary'
  },
  thcContent: Number,
  cbdContent: Number,
  avgRating: Number
  // Consider adding flavors and effects
});

module.exports = mongoose.model("Strain", strainSchema);