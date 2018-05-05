const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const MongoClient    = require('mongodb').MongoClient;
const mongoose       = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/test');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const dispensaryRoutes = require('./routes/dispensaries');
const strainRoutes = require('./routes/strains');
const reviewRoutes = require('./routes/reviews');

app.use(indexRoutes);
app.use(userRoutes);
app.use('/dispensaries', dispensaryRoutes);
app.use('/dispensaries/:id/strains', strainRoutes);
app.use('/dispensaries/:id', reviewRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});