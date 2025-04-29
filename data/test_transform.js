const fs = require('fs');
const { combineData, saveDataToFile, mergePropertiesFiles } = require('./transformData');

// Use absolute paths for the JSON files
const ruralData = JSON.parse(fs.readFileSync('/home/adityaraut/Documents/hackathon_property/data/ruralProperties.json', 'utf-8'));
const urbanData = JSON.parse(fs.readFileSync('/home/adityaraut/Documents/hackathon_property/data/urbanProperties.json', 'utf-8'));
const cersaiData = JSON.parse(fs.readFileSync('/home/adityaraut/Documents/hackathon_property/data/CERSAIData.json', 'utf-8'));
const mcaData = JSON.parse(fs.readFileSync('/home/adityaraut/Documents/hackathon_property/data/MCA21Data.json', 'utf-8'));

// Combine the real data arrays into one unified array
const unifiedData = combineData(ruralData, urbanData, cersaiData, mcaData);
console.log('Unified Data:', unifiedData);

// Save the unified data to file (default file is "./unified_data.json")
saveDataToFile(unifiedData);

// Optionally, test merging properties from ruralProperties.json (if set up)
/*
const mergedData = mergePropertiesFiles();
console.log('Merged Properties Data:', mergedData);
*/

// To run: execute "node /home/adityaraut/Documents/hackathon_property/data/test_transform.js" in your terminal.
