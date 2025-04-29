const express = require('express');
const router = express.Router();
const path = require('path');

// Load database files
const ruralProperties = require(path.join(__dirname, '../data/DLRData.json')); // Changed
const urbanProperties = require(path.join(__dirname, '../data/DORSIData.json')); // Changed
const allProperties = [].concat(ruralProperties, urbanProperties);

// Helper: find property by propertyId or registrationNumber
function findProperty(query) {
  return allProperties.find(p => 
    (query.propertyId && p.propertyId === query.propertyId) ||
    (query.registrationNumber && p.registrationNumber === query.registrationNumber)
  );
}

// /api/doris
router.get('/doris', (req, res) => {
  const dorisData = require('../data/DORSIData.json');
  const cersaiData = require('../data/CERSAIData.json');
  // Combine the two datasets
  const combinedData = dorisData.concat(cersaiData);
  const { propertyId, registrationNumber } = req.query;
  const property = combinedData.find(p =>
    (propertyId && p.propertyId === propertyId) ||
    (registrationNumber && p.registrationNumber === registrationNumber)
  );
  if(property) {
    res.json(property);
  } else {
    res.status(404).json({ error: "Property not found" });
  }
});

// /api/dlr
router.get('/dlr', (req, res) => {
    const dlrData = require('../data/DLRData.json');
    const { propertyId, registrationNumber } = req.query;
    const property = dlrData.find(p =>
         (propertyId && p.propertyId === propertyId) ||
         (registrationNumber && p.registrationNumber === registrationNumber)
    );
    if(property) {
         res.json(property);
    } else {
         res.status(404).json({ error: "Property not found" });
    }
});

// /api/cersai
router.get('/cersai', (req, res) => {
    const cersaiData = require('../data/CERSAIData.json');
    const { propertyId, registrationNumber } = req.query;
    const property = cersaiData.find(p =>
         (propertyId && p.propertyId === propertyId) ||
         (registrationNumber && p.registrationNumber === registrationNumber)
    );
    if(property) {
         res.json(property);
    } else {
         res.status(404).json({ error: "Property not found" });
    }
});

// Updated /api/mca21 endpoint to search in both MCA21Data.json and CERSAIData.json
router.get('/mca21', (req, res) => {
  let mca21Data = [];
  try {
    mca21Data = require('../data/MCA21Data.json');
  } catch (e) {
    // If MCA21Data.json does not exist, use empty array
    mca21Data = [];
  }
  const cersaiData = require('../data/CERSAIData.json');
  // Combine MCA21 and matching CERSAI properties
  // (Here we include all MCA21Data along with CERSAIData as fallback for MCA21 queries)
  const combinedData = mca21Data.concat(cersaiData);
  
  const { propertyId, registrationNumber } = req.query;
  const property = combinedData.find(p =>
    (propertyId && p.propertyId === propertyId) ||
    (registrationNumber && p.registrationNumber === registrationNumber)
  );
  
  if(property) {
    return res.json(property);
  } else {
    return res.status(404).json({ error: "Property not found" });
  }
});

module.exports = router;
