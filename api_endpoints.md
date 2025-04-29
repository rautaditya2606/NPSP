# API Endpoints Documentation

## Core Property Search Endpoints

### 1. Get All Properties
```bash
GET http://localhost:8080/api/properties
```

### 2. Search by Property ID
```bash
GET http://localhost:8080/api/property/{propertyId}
Example: http://localhost:8080/api/property/2212064823
```

### 3. Search by Registration Number
```bash
GET http://localhost:8080/api/registration/{registrationNumber}
Example: http://localhost:8080/api/registration/2005202112345
```

## Standard Response Format
All endpoints return properties in this format:
```json
{
  "propertyId": "2212064823",
  "ownerName": "Vikram Singh",
  "registrationNumber": "2005202112345",
  "state": "Uttar Pradesh",
  "district": "Varanasi", 
  "subDistrict": "Rural Varanasi",
  "cityOrVillage": "Pindra",
  "pincode": "221206",
  "registrationDate": "2021-05-20",
  "address": "Plot No. 47, Near Hanuman Mandir, Pindra, Varanasi, Uttar Pradesh - 221206",
  "latitude": 25.32,
  "longitude": 82.98,
  "squareFeet": 4350,
  "encumbrances": ["Mortgage"],
  "ownership_type": "individual",
  "source": "DLR"
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| propertyId | String | Unique 10-digit identifier |
| ownerName | String | Full name of property owner |
| registrationNumber | String | 13-digit registration number |
| state | String | State location |
| district | String | District location |
| subDistrict | String | Sub-division/Taluka |
| cityOrVillage | String | City or village name |
| pincode | String | 6-digit postal code |
| registrationDate | String | Date in YYYY-MM-DD format |
| address | String | Complete property address |
| latitude | Number | Location latitude |
| longitude | Number | Location longitude |
| squareFeet | Number | Property area in sq ft |
| encumbrances | Array | List of legal claims |
| ownership_type | String | Type of ownership |
| source | String | Data source (DLR/DORSI/CERSAI/MCA21) |

## Error Responses

1. Property Not Found (404):
```json
{
  "error": "Property not found"
}
```

2. Server Error (500):
```json
{
  "error": "Error message details"
}
```

## Notes
- All numeric values (latitude, longitude, squareFeet) are returned as numbers, not strings
- Empty arrays are returned for missing encumbrances
- Source is determined from propertyId prefix
- Default ownership_type is "individual"
