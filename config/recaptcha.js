require('dotenv').config();

module.exports = {
	siteKey: process.env.RECAPTCHA_SITE_KEY,
	secretKey: process.env.RECAPTCHA_SECRET_KEY,
};