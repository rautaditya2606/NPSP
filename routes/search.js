const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearchInput } = require('../middleware/validation');

router.get('/', searchController.renderSearchForm);
router.post('/search', validateSearchInput, searchController.processSearch);

module.exports = router;
