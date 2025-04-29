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
    const property = findProperty(req.query);
    if(property) {
        res.json({
            source: 'DORIS',
            propertyId: property.propertyId,
            registrationNumber: property.registrationNumber,
            ownerName: property.ownerName,
            registrationDate: property.registrationDate,
            encumbrances: property.encumbrances,
            loanStatus: 'No Loan'
        });
    } else {
        res.status(404).json({ error: 'Property not found' });
    }
});

// /api/dlr
router.get('/dlr', (req, res) => {
    const property = findProperty(req.query);
    if(property) {
        res.json({
            source: 'DLR',
            propertyId: property.propertyId,
            registrationNumber: property.registrationNumber,
            ownerName: property.ownerName,
            registrationDate: property.registrationDate,
            encumbrances: property.encumbrances,
            loanStatus: 'Loan Approved'
        });
    } else {
        res.status(404).json({ error: 'Property not found' });
    }
});

// /api/cersai
router.get('/cersai', (req, res) => {
    const property = findProperty(req.query);
    if(property) {
        res.json({
            source: 'CERSAI',
            propertyId: property.propertyId,
            registrationNumber: property.registrationNumber,
            ownerName: property.ownerName,
            registrationDate: property.registrationDate,
            encumbrances: property.encumbrances,
            loanStatus: 'Pending Discharge'
        });
    } else {
        res.status(404).json({ error: 'Property not found' });
    }
});

// /api/mca21
router.get('/mca21', (req, res) => {
    const property = findProperty(req.query);
    if(property) {
        res.json({
            source: 'MCA21',
            propertyId: property.propertyId,
            registrationNumber: property.registrationNumber,
            ownerName: property.ownerName,
            registrationDate: property.registrationDate,
            encumbrances: property.encumbrances,
            loanStatus: 'Loan Under Process'
        });
    } else {
        res.status(404).json({ error: 'Property not found' });
    }
});

module.exports = router;
