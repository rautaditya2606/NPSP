const path = require('path');
const fs = require('fs');

// Utility to load JSON data files
function loadJSON(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf-8'));
}

exports.renderSearchForm = (req, res) => {
  res.render('index', { title: 'Property Search' });
};

exports.processSearch = (req, res) => {
  const { method, searchValue, firstName, lastName } = req.body;
  
  // Load both datasets
  const urbanProps = loadJSON('data/urbanProperties.json');
  const ruralProps = loadJSON('data/ruralProperties.json');
  
  // Always search through combined datasets
  const dataset = urbanProps.concat(ruralProps);
  
  const results = dataset.filter(property => {
    if(method === 'ownerName') {
      // Combine first and last name, trim extra spaces
      const fullName = ((firstName || "") + " " + (lastName || "")).trim().toLowerCase();
      return property.ownerName && property.ownerName.toLowerCase().includes(fullName);
    } else {
      // For propertyId or registrationNumber search
      const fieldMap = {
        propertyId: 'propertyId',
        registrationNumber: 'registrationNumber'
      };
      const propertyField = fieldMap[method];
      return property[propertyField] &&
             searchValue &&
             property[propertyField].toLowerCase().includes(searchValue.toLowerCase());
    }
  });
  
  res.render('results', { title: 'Search Results', results });
};
