const determineOwnershipType = (property) => {
  const commercialKeywords = ['office', 'shop', 'commercial', 'business', 'corporate'];
  const hasCommercialKeywords = commercialKeywords.some(keyword => 
    property.address?.toLowerCase().includes(keyword) ||
    property.encumbrances?.some(e => e.toLowerCase().includes(keyword))
  );
  return hasCommercialKeywords ? 'commercial' : 'individual';
};

const determineSource = (property) => {
  const propertyId = property.propertyId || '';
  if (propertyId.startsWith('22') || propertyId.startsWith('82')) return 'DLR';
  if (propertyId.startsWith('40') || propertyId.startsWith('56')) return 'DORSI';
  if (propertyId.startsWith('11') || propertyId.startsWith('60')) return 'CERSAI';
  if (propertyId.startsWith('80') || propertyId.startsWith('41')) return 'MCA21';
  return 'UNKNOWN';
};

const transformPropertyResponse = (property) => {
  return {
    property_id: property.propertyId || 'UNKNOWN',
    owner_name: property.ownerName || 'Not Available',
    registration_number: property.registrationNumber || 'Not Available',
    ownership_type: determineOwnershipType(property),
    address: property.address || 'Address Not Available',
    registration_date: property.registrationDate || '2000-01-01',
    source: determineSource(property)
  };
};

module.exports = { transformPropertyResponse };
