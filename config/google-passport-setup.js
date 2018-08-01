const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const {ObjectId} = require('mongodb');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
  // This will be hidden before the application is live
  clientID: '763989485378-61scgu4a49pq627kfgd2pvevk6eru616.apps.googleusercontent.com',
  clientSecret: 'U42120mFU_MJ1CxrLlyV13ec',
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