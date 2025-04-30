const path = require('path');
const fs = require('fs');
const axios = require('axios');

const dlrData = require('../data/DLRData.json');
const cersaiData = require('../data/CERSAIData.json');
const dorsiData = require('../data/DORSIData.json');

// Utility to load JSON data files
function loadJSON(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf-8'));
}

exports.renderSearchForm = (req, res) => {
  res.render('index', { title: 'Property Search' });
};

exports.processSearch = async (req, res) => {
    try {
        console.log('Search criteria:', req.body);
        const { method, firstName, lastName, searchValue } = req.body;
        
        // Combine all data sources
        const allProperties = [...dlrData, ...cersaiData, ...dorsiData];
        let results = [];

        switch (method) {
            case 'ownerName':
                // Normalize name search
                const searchName = `${firstName || ''} ${lastName || ''}`.trim().toLowerCase();
                if (!searchName) break;
                
                results = allProperties.filter(property => 
                    property.ownerName && 
                    property.ownerName.toLowerCase().includes(searchName)
                );
                break;

            case 'propertyId':
                // Exact match for propertyId
                if (!searchValue) break;
                results = allProperties.filter(property => 
                    property.propertyId && 
                    property.propertyId.toString() === searchValue.toString()
                );
                break;

            case 'registrationNumber':
                // Exact match for registrationNumber
                if (!searchValue) break;
                results = allProperties.filter(property => 
                    property.registrationNumber && 
                    property.registrationNumber.toString() === searchValue.toString()
                );
                break;
        }

        console.log(`Search Method: ${method}`);
        console.log(`Found ${results.length} results`);

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
