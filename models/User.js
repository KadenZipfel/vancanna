const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    require: true,
    trim: true
  },
  password: {
    type: String
  },
  points: {
    type: Number
  },
  admin: {
    type: Boolean,
    default: false
  },
  moderator: {
    type: Boolean,
    default: false
  },
  favStrains: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strain'
  }], 
  favDispensaries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispensary'
  }]
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);
module.exports = User;