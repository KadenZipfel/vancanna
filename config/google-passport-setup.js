const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const {ObjectId} = require('mongodb');
const keys = require('./keys');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/login/google/redirect'
}, (accessToken, refreshToken, profile, done) => {
  // Check if user exists
  User.findOne({googleId: profile.id}).then((user) => {
    if(user) {
      console.log('User: ', user);
      done(null, user);
    } else {
      new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.email
      }).save().then((user) => {
        console.log('New user: ' + user);
        done(null, user);
      });
    }
  });
}));