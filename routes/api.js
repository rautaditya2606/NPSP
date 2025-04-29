const express = require('express');
const router = express.Router();

const transformProperty = (property) => {
  // Determine source based on property ID
  let source = 'UNKNOWN';
  const id = property.propertyId;
  if (id.startsWith('22') || id.startsWith('82')) source = 'DLR';
  else if (id.startsWith('40') || id.startsWith('56')) source = 'DORSI';
  else if (id.startsWith('11') || id.startsWith('60')) source = 'CERSAI';
  else if (id.startsWith('80') || id.startsWith('41')) source = 'MCA21';

  return {
    propertyId: property.propertyId,
    ownerName: property.ownerName,
    registrationNumber: property.registrationNumber,
    state: property.state,
    district: property.district,
    subDistrict: property.subDistrict,
    cityOrVillage: property.cityOrVillage,
    pincode: property.pincode,
    registrationDate: property.registrationDate,
    address: property.address,
    latitude: parseFloat(property.latitude),
    longitude: parseFloat(property.longitude),
    squareFeet: parseInt(property.squareFeet || 0),
    encumbrances: property.encumbrances || [],
    ownership_type: "individual",
    source: source
  };
};

router.get('/properties', (req, res) => {
  try {
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data]
      .map(transformProperty);

    res.json(allProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/property/:propertyId', (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    const property = allProperties.find(p => p.propertyId === propertyId);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(transformProperty(property));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/registration/:registrationNumber', (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber;
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    const property = allProperties.find(p => p.registrationNumber === registrationNumber);

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(transformProperty(property));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update search registration endpoint
router.get('/search/registration/:id', (req, res) => {
  try {
    const registrationId = req.params.id;
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    const property = allProperties.find(p => p.registrationNumber === registrationId);

    if (!property) {
      return res.render('results', { 
        results: [], 
        locale: req.getLocale() 
      });
    }

    const transformedProperty = transformProperty(property);
    res.render('results', { 
      results: [transformedProperty], 
      locale: req.getLocale() 
    });
  } catch (error) {
    res.status(500).render('results', { 
      results: [], 
      locale: req.getLocale(),
      error: error.message 
    });
  }
});

module.exports = router;
