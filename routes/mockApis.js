const express = require('express');
const router = express.Router();
const path = require('path');
const ruralProperties = require(path.join(__dirname, '../data/ruralProperties.json'));
const urbanProperties = require(path.join(__dirname, '../data/urbanProperties.json'));

// Dummy response converter to common format
function toCommonFormat(source, data) {
    return {
        propertyId: data.propertyId || "",
        ownerName: data.ownerName || "",
        registrationNumber: data.registrationNumber || "",
        encumbrances: data.encumbrances || [],
        source: source
    };
}

// DORIS API mock endpoint
router.get('/doris', (req, res) => {
    // Design request format if required: e.g. query parameters
    // Return dummy data in common format
    const dummyData = {
        propertyId: "DORIS-12345",
        ownerName: "John Doe",
        registrationNumber: "DORIS-REG-001",
        encumbrances: ["Mortgage", "Lien"]
    };
    res.json(toCommonFormat("DORIS", dummyData));
});

// DLR API mock endpoint
router.get('/dlr', (req, res) => {
    const dummyData = {
        propertyId: "DLR-98765",
        ownerName: "Jane Smith",
        registrationNumber: "DLR-REG-002",
        encumbrances: ["Property Tax Pending"]
    };
    res.json(toCommonFormat("DLR", dummyData));
});

// CERSAI API mock endpoint
router.get('/cersai', (req, res) => {
    const dummyData = {
        propertyId: "CERSAI-55555",
        ownerName: "Alice Johnson",
        registrationNumber: "CERSAI-REG-003",
        encumbrances: ["Encumbrance Certificate Issued"]
    };
    res.json(toCommonFormat("CERSAI", dummyData));
});

// MCA21 API mock endpoint
router.get('/mca21', (req, res) => {
    const dummyData = {
        propertyId: "MCA21-22222",
        ownerName: "XYZ Corp",
        registrationNumber: "MCA21-REG-004",
        encumbrances: ["Corporate Charge"]
    };
    res.json(toCommonFormat("MCA21", dummyData));
});

// New endpoint to display the whole database (rural + urban properties)
router.get('/all-properties', (req, res) => {
    const allProperties = [].concat(ruralProperties, urbanProperties);
    res.json(allProperties);
});

module.exports = router;
