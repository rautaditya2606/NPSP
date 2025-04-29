const express = require('express');
const fs = require('fs');
const path = require('path');
const { combineData } = require('./data/transformData');

const app = express();

// Helper to load a JSON file from the data folder
function loadData(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Load all data sources from the data folder
const ruralData = loadData('ruralProperties.json');
const urbanData = loadData('urbanProperties.json');
const cersaiData = loadData('CERSAIData.json');
const mcaData = loadData('MCA21Data.json');

// Combine the data using the transformation functions
const unifiedData = combineData(ruralData, urbanData, cersaiData, mcaData);

// API to search by propertyId
app.get('/api/property/:propertyId', (req, res) => {
  const propertyId = req.params.propertyId;
  // Note: rural transform returns field "propertyId" while others use "property_id"
  const result = unifiedData.filter(item =>
    item.propertyId === propertyId || item.property_id === propertyId
  );
  if (result.length === 0) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json(result);
});

// API to search by registrationNumber
app.get('/api/registration/:registrationNumber', (req, res) => {
  const registrationNumber = req.params.registrationNumber;
  const result = unifiedData.filter(item =>
    item.registrationNumber === registrationNumber
  );
  if (result.length === 0) {
    return res.status(404).json({ error: 'Registration number not found' });
  }
  res.json(result);
});

// API to retrieve all property data
app.get('/api/properties', (req, res) => {
  res.json(unifiedData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
