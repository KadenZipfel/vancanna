const express = require('express');
const router  = express.Router();

// DISPENSARY REVIEWS

// New dispensary review page
router.get('/reviews/new', (req, res) => {
  res.render('reviews/new');
});

// New dispensary review logic
router.post('/reviews', (req, res) => {
  
});

// Edit dispensary review page
router.get('/reviews/:id/edit', (req, res) => {
  res.render('reviews/edit');
});

// Edit dispensary review logic
router.put('/reviews/:id', (req, res) => {
  
});

// Delete dispensary review logic
router.delete('/reviews/:id', (req, res) => {

});


// STRAIN REVIEWS

// New strain review page
router.get('/strains/:id/reviews/new', (req, res) => {
  res.render('reviews/new');
});

// New strain review logic
router.post('/strains/:id/reviews', (req, res) => {
  
});

// Edit strain review page
router.get('/strains/:id/reviews/:id/edit', (req, res) => {
  res.render('reviews/edit');
});

// Edit strain review logic
router.put('/strains/:id/reviews/:id', (req, res) => {
  
});

// Delete strain review logic
router.delete('/strains/:id/reviews/:id', (req, res) => {

});



module.exports = router;