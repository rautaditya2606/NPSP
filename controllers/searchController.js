const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Utility to load JSON data files
function loadJSON(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf-8'));
}

// reCAPTCHA verification function
async function verifyRecaptcha(token) {
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: '6Le_-igrAAAAAKMI5g7hXjj7nijSXpQyENqTdB-B',
        response: token
      }
    });
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

exports.renderSearchForm = (req, res) => {
  res.render('index', { title: 'Property Search' });
};

exports.processSearch = async (req, res) => {
  try {
    const { method, searchValue, firstName, lastName, 'g-recaptcha-response': recaptchaToken } = req.body;
    
    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.render('results', { 
        title: 'Search Results', 
        results: [], 
        error: 'Please complete the reCAPTCHA verification'
      });
    }
    
    // Load both datasets
    const urbanProps = loadJSON('data/DORSIData.json');
    const ruralProps = loadJSON('data/DLRData.json');
    
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
  } catch (error) {
    console.error('Search processing error:', error);
    res.render('results', { 
      title: 'Search Results', 
      results: [], 
      error: 'An error occurred while processing your search' 
    });
  }
};
