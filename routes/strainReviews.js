const express = require('express');
const router  = express.Router();

// STRAIN REVIEWS

// New strain review page
router.get('/strains/:id/reviews/new', (req, res) => {
    res.render('strainReviews/new');
  });
  
  // New strain review logic
  router.post('/strains/:id/reviews', (req, res) => {
    
  });
  
  // Edit strain review page
  router.get('/strains/:id/reviews/:id/edit', (req, res) => {
    res.render('strainReviews/edit');
  });
  
  // Edit strain review logic
  router.put('/strains/:id/reviews/:id', (req, res) => {
    
  });
  
  // Delete strain review logic
  router.delete('/strains/:id/reviews/:id', (req, res) => {
  
  });

  module.exports = router;