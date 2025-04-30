const express = require('express');
const router = express.Router();

// GET /contact - render page
router.get('/contact', (req, res) => {
    res.render('contact');
});

// POST /contact - process form submission
router.post('/contact', async (req, res) => {
    // Process contact submission
    res.send('Contact form submitted.');
});

module.exports = router;