const express = require('express');
const router = express.Router();
const axios = require('axios');
const recaptcha = require('../config/recaptcha');

// reCAPTCHA verification function
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: '6Le_-igrAAAAAKMI5g7hXjj7nijSXpQyENqTdB-B',
                response: token
            }
        });
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
}

// GET /contact - render page with recaptcha site key
router.get('/contact', (req, res) => {
    res.render('contact', {
        recaptchaSiteKey: recaptcha.siteKey,
    });
});

// POST /contact - verify recaptcha token on form submission
router.post('/contact', async (req, res) => {
    const token = req.body['g-recaptcha-response'];
    const secret = recaptcha.secretKey;

    // Verify the recaptcha token
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const response = await axios.post(verifyUrl);
    const data = response.data;

    if (!data.success) {
        return res.status(400).send('Recaptcha validation failed.');
    }

    // Process contact submission
    res.send('Contact form submitted.');
});

// Contact form submission handler
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message, 'g-recaptcha-response': recaptchaToken } = req.body;

        // Verify reCAPTCHA
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        
        if (!isRecaptchaValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please complete the reCAPTCHA verification' 
            });
        }

        // Here you would typically save the message to a database
        // or send it via email. For now, we'll just send a success response.
        
        res.json({ 
            success: true, 
            message: 'Thank you for your message. We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred while processing your request.' 
        });
    }
});

module.exports = router;