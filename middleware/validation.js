exports.validateSearchInput = (req, res, next) => {
    const { method } = req.body;

    try {
        // For owner name search
        if (method === 'ownerName') {
            const { firstName, lastName } = req.body;
            if (!firstName?.trim() || !lastName?.trim()) {
                return res.status(400).json({ 
                    error: 'Both first name and last name are required',
                    field: !firstName?.trim() ? 'firstName' : 'lastName'
                });
            }
        } else {
            // For property ID and registration number
            const { searchValue } = req.body;
            if (!searchValue?.trim()) {
                return res.status(400).json({ 
                    error: `Please enter a valid ${method === 'propertyId' ? 'Property ID' : 'Registration Number'}`,
                    field: 'searchValue'
                });
            }

            // Specific validations
            if (method === 'propertyId' && !/^\d{10}$/.test(searchValue)) {
                return res.status(400).json({ 
                    error: 'Property ID must be exactly 10 digits',
                    field: 'searchValue'
                });
            }
            if (method === 'registrationNumber' && !/^\d{13}$/.test(searchValue)) {
                return res.status(400).json({ 
                    error: 'Registration Number must be exactly 13 digits',
                    field: 'searchValue'
                });
            }
        }
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
