const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const mongoose       = require('mongoose');
const MongoClient    = require('mongodb').MongoClient;
const assert         = require('assert');
const session        = require('express-session');
const MongoStore     = require('connect-mongo')(session);
const passport       = require('passport');
const LocalStrategy  = require('passport-local');
const User           = require('./models/User');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/vancanna-test');
// This will be hidden when the application is live
// mongoose.connect('mongodb://vancanna:password123@ds153775.mlab.com:53775/vancanna');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

// Passport Config
// This will be hidden once the application is live
app.use(require('express-session')({
  secret: 'shhh its a secret',
  resave: false,
  saveUninitialized: false,
  maxAge: 365 * 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const dispensaryRoutes = require('./routes/dispensaries');
const strainRoutes = require('./routes/strains');
const dispensaryReviewRoutes = require('./routes/dispensaryReviews');
const strainReviewRoutes = require('./routes/strainReviews');

app.use(indexRoutes);
app.use(userRoutes);
app.use('/dispensaries', dispensaryRoutes);
app.use('/dispensaries/:id/strains', strainRoutes);
app.use('/dispensaries/:id', dispensaryReviewRoutes);
app.use('/dispensaries/:id/strains/:id', strainReviewRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});