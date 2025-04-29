const CERSAIData = require('../data/CERSAIData.json');
const DLRData = require('../data/DLRData.json');
const DORSIData = require('../data/DORSIData.json');
const MCA21Data = require('../data/MCA21Data.json');

function transformData() {
  const allProperties = [
    ...CERSAIData.properties,
    ...DLRData.properties,
    ...DORSIData.properties,
    ...MCA21Data.properties
  ];

  return allProperties;
}

module.exports = transformData;
