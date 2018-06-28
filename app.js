const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const mongoose       = require('mongoose');
const MongoClient    = require('mongodb').MongoClient;
const assert         = require('assert');
const session        = require('express-session');
const MongoStore     = require('connect-mongo')(session);

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/vancanna-test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'smoke weed',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

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