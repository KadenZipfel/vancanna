const express = require('express');
const router  = express.Router();

// New strain page
router.get('/new', (req, res) => {
  res.render('strains/new');
});

// New strain logic
router.post('/', (req, res) => {
  
});

// Strain show page
router.get('/:id', (req, res) => {
  res.render('strains/show');
});

// Strain edit page
router.get('/:id/edit', (req, res) => {
  res.render('strains/edit');
});

// Strain edit logic
router.put('/:id', (req, res) => {
  
});

// Strain delete logic
router.delete('/:id', (req, res) => {
  
});

module.exports = router;