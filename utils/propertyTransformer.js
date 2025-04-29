const standardizeProperty = (property, source) => {
  return {
    id: property.id || property.propertyId || generateId(),
    propertyDetails: {
      propertyId: property.propertyId || property.id || '',
      registrationNumber: property.registrationNumber || '',
      propertyType: property.propertyType || property.type || 'unspecified',
      propertyZone: property.propertyZone || determineZone(property),
      propertyArea: {
        value: getPropertyArea(property),
        unit: 'sqft'
      },
      buildingDetails: standardizeBuildingDetails(property),
      amenities: standardizeAmenities(property),
      utilities: standardizeUtilities(property)
    },
    ownerInfo: {
      name: property.ownerName || (property.ownerInfo && property.ownerInfo.name) || '',
      contactDetails: {
        email: getContactEmail(property),
        phone: getContactPhone(property)
      }
    },
    location: {
      address: property.address || (property.location && property.location.address) || '',
      state: property.state || (property.location && property.location.state) || '',
      district: property.district || (property.location && property.location.district) || '',
      subDistrict: property.subDistrict || (property.location && property.location.subDistrict) || '',
      cityOrVillage: property.cityOrVillage || (property.location && property.location.cityOrVillage) || '',
      pincode: property.pincode || (property.location && property.location.pincode) || '',
      coordinates: {
        latitude: property.latitude || (property.location && property.location.coordinates && property.location.coordinates.latitude) || '',
        longitude: property.longitude || (property.location && property.location.coordinates && property.location.coordinates.longitude) || ''
      }
    },
    registration: {
      number: property.registrationNumber || '',
      date: property.registrationDate || '',
      status: 'active'
    },
    encumbrances: property.encumbrances || [],
    metadata: {
      source: source,
      lastUpdated: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending'
    },
    additionalDetails: getSourceSpecificDetails(property, source)
  };
};

// Helper functions
function determineZone(property) {
  if (property.propertyZone) return property.propertyZone;
  return property.subDistrict?.toLowerCase().includes('rural') ? 'rural' : 'urban';
}

function standardizeBuildingDetails(property) {
  const details = property.buildingDetails || {};
  return {
    totalFloors: details.totalFloors || 0,
    floorNumber: details.floorNumber || 0,
    carpetArea: details.carpetArea || 'NA',
    builtUpArea: details.builtUpArea || 'NA',
    parkingSlots: details.parkingSlots || 0
  };
}

function standardizeAmenities(property) {
  const amenities = property.amenities || {};
  return {
    lift: amenities.lift || false,
    swimmingPool: amenities.swimmingPool || false,
    gym: amenities.gym || false,
    parking: amenities.parking || 'none',
    security: amenities.security || 'none'
  };
}

function getSourceSpecificDetails(property, source) {
  switch(source) {
    case 'DLR':
      return {
        landDetails: property.landDetails || {},
        agriculturalInfo: property.agriculturalInfo || {},
        villageOfficeDetails: property.villageOfficeDetails || {}
      };
    case 'DORSI':
      return {
        societyDetails: property.societyDetails || {},
        commercialStatus: property.commercialStatus || {}
      };
    case 'CERSAI':
      return {
        securityDetails: property.securityDetails || {},
        loanDetails: property.loanDetails || {},
        collateralInfo: property.collateralInfo || {}
      };
    case 'MCA21':
      return {
        businessDetails: property.businessDetails || {},
        corporateCompliance: property.corporateCompliance || {},
        leaseStatus: property.leaseStatus || {}
      };
    default:
      return {};
  }
}

module.exports = { standardizeProperty };
