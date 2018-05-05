const express = require('express');
const router  = express.Router();

// Dispensaries index
router.get('/', (req, res) => {
  res.render('dispensaries/index');
});

// New dispensary page
router.get('/new', (req, res) => {
  res.render('dispensaries/new');
});

// New dispensary logic
router.post('/', (req, res) => {
  
});

// Dispensary show page
router.get('/:id', (req, res) => {
  res.render('dispensaries/show');
});

// Edit dispensary page
router.get('/:id/edit', (req, res) => {
  res.render('dispensaries/edit');
});

// Edit dispensary logic
router.put('/:id', (req, res) => {
  
});

// Delete dispensary logic
router.delete('/:id', (req, res) => {

});

module.exports = router;