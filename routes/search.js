const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearchInput } = require('../middleware/validation');

router.get('/', searchController.renderSearchForm);

// GET /search - render page
router.get('/search', (req, res) => {
    res.render('search');
});

// POST /search - process search request
router.post('/search', validateSearchInput, searchController.processSearch);

module.exports = router;
