const fs = require('fs');
const { standardizeProperty } = require('../utils/propertyTransformer');

// Transform function for rural data
function transformRuralData(data) {
  return standardizeProperty(data, 'DLR');
}

// Transform function for urban data
function transformUrbanData(data) {
  return standardizeProperty(data, 'DORSI');
}

// Transform function for CERSAI data
function transformCERSAIData(data) {
  return standardizeProperty(data, 'CERSAI');
}

// Transform function for MCA21 data
function transformMCA21Data(data) {
  return standardizeProperty(data, 'MCA21');
}

// Combine all transformed data arrays into one unified array
function combineData(ruralRaw, urbanRaw, cersaiRaw, mcaRaw) {
  const unifiedData = [
    ...ruralRaw.map(transformRuralData),
    ...urbanRaw.map(transformUrbanData),
    ...cersaiRaw.map(transformCERSAIData),
    ...mcaRaw.map(transformMCA21Data)
  ];
  
  // Remove duplicates based on propertyId
  const uniqueData = Array.from(new Map(
    unifiedData.map(item => [item.propertyDetails.propertyId, item])
  ).values());
  
  return uniqueData;
}

// Save unified data to a JSON file
function saveDataToFile(data, filePath = './unified_data.json') {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Merge properties files: read only from ruralProperties.json since urban data is merged there.
function mergePropertiesFiles() {
  const ruralFile = './ruralProperties.json'; // merged rural & urban data
  const propertiesFile = './properties.json';
  let ruralData = [];
  try {
    ruralData = JSON.parse(fs.readFileSync(ruralFile, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${ruralFile}:`, err);
  }
  fs.writeFileSync(propertiesFile, JSON.stringify(ruralData, null, 2), 'utf-8');
  return ruralData;
}

module.exports = {
  transformRuralData,
  transformUrbanData,
  transformCERSAIData,
  transformMCA21Data,
  combineData,
  saveDataToFile,
  mergePropertiesFiles
};