const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearchInput } = require('../middleware/validation');
const recaptcha = require('../config/recaptcha');

router.get('/', searchController.renderSearchForm);

// GET /search - render page with recaptcha site key
router.get('/search', (req, res) => {
  res.render('search', {
    recaptchaSiteKey: recaptcha.siteKey,
  });
});

// POST /search - verify recaptcha token on search submission
router.post('/search', async (req, res) => {
  const token = req.body['g-recaptcha-response'];
  const secret = recaptcha.secretKey;

  // Verify the recaptcha token
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const response = await fetch(verifyUrl, { method: 'POST' });
  const data = await response.json();
  
  if (!data.success) {
    return res.status(400).send('Recaptcha validation failed.');
  }
  
  // Process search request
  res.send('Search results.');
});

router.post('/search', validateSearchInput, searchController.processSearch);

module.exports = router;
