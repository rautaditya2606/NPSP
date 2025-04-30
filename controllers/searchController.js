const path = require('path');
const fs = require('fs');
const axios = require('axios');

const dlrData = require('../data/DLRData.json');
const cersaiData = require('../data/CERSAIData.json');

// Utility to load JSON data files
function loadJSON(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf-8'));
}

exports.renderSearchForm = (req, res) => {
  res.render('index', { title: 'Property Search' });
};

exports.processSearch = async (req, res) => {
    try {
        console.log('Search criteria:', req.body); // Debug log

        const { method, firstName, lastName, searchValue } = req.body;
        let results = [];

        switch (method) {
            case 'ownerName':
                const fullName = `${firstName} ${lastName}`.toLowerCase().trim();
                results = [...dlrData, ...cersaiData].filter(property => 
                    property.ownerName.toLowerCase().includes(fullName)
                );
                break;

            case 'propertyId':
                results = [...dlrData, ...cersaiData].filter(property => 
                    property.propertyId === searchValue
                );
                break;

            case 'registrationNumber':
                results = [...dlrData, ...cersaiData].filter(property => 
                    property.registrationNumber === searchValue
                );
                break;
        }

        console.log('Search results:', results); // Debug log

        return res.render('results', {
            results,
            locale: req.getLocale(),
            __: req.__,
            errorMessage: results.length === 0 ? 'No Results Found. Try adjusting your search criteria' : null
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.render('results', {
            results: [],
            locale: req.getLocale(),
            __: req.__,
            errorMessage: 'An error occurred while searching. Please try again.'
        });
    }
};
