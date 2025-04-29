const express = require('express');
const router = express.Router();
const path = require('path');
const ruralProperties = require(path.join(__dirname, '../data/DLRData.json'));
const urbanProperties = require(path.join(__dirname, '../data/DORSIData.json'));


function toCommonFormat(source, data) {
    return {
        propertyId: data.propertyId || "",
        ownerName: data.ownerName || "",
        registrationNumber: data.registrationNumber || "",
        encumbrances: data.encumbrances || [],
        source: source
    };
}


router.get('/doris', (req, res) => {
    const dummyData = {
        propertyId: "DORIS-12345",
        ownerName: "John Doe",
        registrationNumber: "DORIS-REG-001",
        encumbrances: ["Mortgage", "Lien"]
    };
    res.json(toCommonFormat("DORIS", dummyData));
});


router.get('/dlr', (req, res) => {
    const dummyData = {
        propertyId: "DLR-98765",
        ownerName: "Jane Smith",
        registrationNumber: "DLR-REG-002",
        encumbrances: ["Property Tax Pending"]
    };
    res.json(toCommonFormat("DLR", dummyData));
});


router.get('/cersai', (req, res) => {
    const dummyData = {
        propertyId: "CERSAI-55555",
        ownerName: "Alice Johnson",
        registrationNumber: "CERSAI-REG-003",
        encumbrances: ["Encumbrance Certificate Issued"]
    };
    res.json(toCommonFormat("CERSAI", dummyData));
});


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
