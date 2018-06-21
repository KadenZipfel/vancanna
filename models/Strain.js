const mongoose = require('mongoose');

const strainSchema = new mongoose.Schema({
  name: String,
  image: String, // To be changed to array of multiple images
  type: String,
  description: String, 
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
  // thcContent and cbdContent to be added
  // Fields such as flavours and effects to be added
  // avgRating should somehow be added
});

module.exports = mongoose.model("Strain", strainSchema);