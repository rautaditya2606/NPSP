exports.validateSearchInput = (req, res, next) => {
  const { method, searchValue, firstName, lastName } = req.body;
  if (!method) {
    return res.status(400).send('Missing required search parameters.');
  }
  if(method === 'ownerName'){
    if (!(firstName || lastName)) {
      return res.status(400).send('Search value is required for owner name (either first name or last name).');
    }
  } else {
    if (!searchValue || searchValue.trim() === '') {
      return res.status(400).send('Search value is required.');
    }
  }
  next();
};
