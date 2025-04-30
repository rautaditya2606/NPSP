const express = require('express');
const router = express.Router();
const axios = require('axios');

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