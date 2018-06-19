const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String, // To be changed to user model
  rating: Number,
  body: String
});

module.exports = mongoose.model('Review', reviewSchema);