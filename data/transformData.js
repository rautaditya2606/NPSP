// Helper: format date from DD/MM/YYYY to YYYY-MM-DD
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Transform function for rural data
function transformRuralData(data) {
  return {
    propertyId: data.propertyId || 'N/A',
    ownerName: data.ownerName || 'N/A',
    registrationNumber: data.registrationNumber || 'N/A',  // new field added
    ownership_type: data.type || 'individual',
    address: data.address || 'Not available',
    registrationDate: data.registrationDate || 'N/A',
    source: 'rural'
  };
}

// Transform function for urban data
function transformUrbanData(data) {
  return {
    property_id: data.propertyId || 'N/A',
    owner_name: data.ownerName || 'N/A',
    registrationNumber: data.registrationNumber || 'N/A',  // new field added
    ownership_type: data.type || 'individual',
    address: data.address || 'Not available',
    registration_date: data.registrationDate || 'N/A',
    source: 'urban'
  };
}

// Transform function for CERSAI data
function transformCERSAIData(data) {
  return {
    property_id: data.propertyId || 'N/A',
    owner_name: data.ownerName || 'N/A',
    registrationNumber: data.registrationNumber || 'N/A',  // new field added
    ownership_type: data.type || 'individual',
    address: data.address || 'Not Available',
    registration_date: data.registrationDate || 'N/A',
    source: 'CERSAI'
  };
}

// Transform function for MCA21 data
function transformMCA21Data(data) {
  return {
    property_id: data.propertyId || 'N/A',
    owner_name: data.ownerName || 'N/A',
    registrationNumber: data.registrationNumber || 'N/A',  // new field added
    ownership_type: data.type || 'individual',
    address: data.address || 'Not Available',
    registration_date: data.registrationDate || 'N/A',
    source: 'MCA21'
  };
}

// Combine all transformed data arrays into one unified array
function combineData(ruralRaw, urbanRaw, cersaiRaw, mcaRaw) {
  const unifiedData = [
    ...ruralRaw.map(transformRuralData),
    ...urbanRaw.map(transformUrbanData),
    ...cersaiRaw.map(transformCERSAIData),
    ...mcaRaw.map(transformMCA21Data)
  ];
  return unifiedData;
}

// Save unified data to a JSON file
const fs = require('fs');
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