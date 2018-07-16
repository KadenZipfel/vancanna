const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  text: String,
  rating: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  flavors: String,
  effects: String
});

module.exports = mongoose.model('Review', reviewSchema);