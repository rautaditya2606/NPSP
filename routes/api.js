const express = require('express');
const router = express.Router();
const fs = require('fs');
const { combineData, transformDLRData, transformDORSIData, transformCERSAIData, transformMCA21Data } = require('../data/transformData');

// Input validation middleware
const validateInput = (req, res, next) => {
  const param = req.params.number || req.params.name;
  if (!param || param.length < 2) {
    return res.status(400).json({ error: 'Invalid input parameter' });
  }
  next();
};

// GET all properties from all sources
router.get('/properties', (req, res) => {
  try {
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const combinedData = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET properties by source
router.get('/properties/:source', (req, res) => {
  try {
    const source = req.params.source.toLowerCase();
    let data;
    
    switch(source) {
      case 'dlr':
        data = require('../data/DLRData.json').properties.map(transformDLRData);
        break;
      case 'dorsi':
        data = require('../data/DORSIData.json').properties.map(transformDORSIData);
        break;
      case 'cersai':
        data = require('../data/CERSAIData.json').properties.map(transformCERSAIData);
        break;
      case 'mca21':
        data = require('../data/MCA21Data.json').properties.map(transformMCA21Data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid source' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search properties by registration number with validation
router.get('/search/registration/:number', validateInput, (req, res) => {
  try {
    const regNumber = decodeURIComponent(req.params.number);
    const dlrData = require('../data/DLRData.json').properties;
    const dorsiData = require('../data/DORSIData.json').properties;
    const cersaiData = require('../data/CERSAIData.json').properties;
    const mca21Data = require('../data/MCA21Data.json').properties;

    const combinedData = combineData(dlrData, dorsiData, cersaiData, mca21Data);
    const results = combinedData.filter(p => 
      p.registrationNumber && p.registrationNumber.toLowerCase() === regNumber.toLowerCase()
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Invalid registration number format' });
  }
});

// Search properties by owner name with validation
router.get('/search/owner/:name', validateInput, (req, res) => {
  try {
    const ownerName = decodeURIComponent(req.params.name.toLowerCase());
    const dlrData = require('../data/DLRData.json').properties;
    const dorsiData = require('../data/DORSIData.json').properties;
    const cersaiData = require('../data/CERSAIData.json').properties;
    const mca21Data = require('../data/MCA21Data.json').properties;

    const combinedData = combineData(dlrData, dorsiData, cersaiData, mca21Data);
    const results = combinedData.filter(p => {
      const name = p.ownerName || p.owner_name || '';
      return name.toLowerCase().includes(ownerName);
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Invalid name format' });
  }
});

// GET property by ID
router.get('/property/:propertyId', (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    
    const property = allProperties.find(p => 
      p.propertyId === propertyId || p.property_id === propertyId
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET property by registration number
router.get('/registration/:registrationNumber', (req, res) => {
  try {
    const registrationNumber = req.params.registrationNumber;
    const dlrData = require('../data/DLRData.json');
    const dorsiData = require('../data/DORSIData.json');
    const cersaiData = require('../data/CERSAIData.json');
    const mca21Data = require('../data/MCA21Data.json');

    const allProperties = [...dlrData, ...dorsiData, ...cersaiData, ...mca21Data];
    
    const property = allProperties.find(p => 
      p.registrationNumber === registrationNumber
    );

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
