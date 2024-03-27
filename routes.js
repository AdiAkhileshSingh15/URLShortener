const express = require('express');
const router = express.Router();
const Url = require('./models');
const nodemailer = require('nodemailer');
const config = require('./config');
const crypto = require('crypto-js');

// Create shortened URL
router.post('/', async (req, res) => {
    try {
        const { originalUrl, requiresLogin, expirationDate, createdBy } = req.body;
        const shortUrlHash = generateHash(originalUrl);
        const url = new Url({
            originalUrl,
            shortUrl: shortUrlHash,
            requiresLogin,
            expirationDate,
            createdBy
        });
        await url.save();
        res.json(url);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Redirect to original URL
router.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (!url) {
            return res.status(404).json({ msg: 'URL not found' });
        }
        if (url.requiresLogin) {
            // Logic to send confirmation email
            sendConfirmationEmail(url.createdBy, url.originalUrl);
            return res.status(401).json({ msg: 'Login required' });
        }
        res.redirect(url.originalUrl);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Send confirmation email
function sendConfirmationEmail(email, originalUrl) {
    const transporter = nodemailer.createTransport(config.email);
    const mailOptions = {
        from: 'adichauhan15092002@gmail.com',
        to: email,
        subject: 'URL Access Confirmation',
        text: `Your URL ${originalUrl} has been accessed.`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Generate a hash for short URL
function generateHash(originalUrl) {
    const hash = crypto.SHA256(originalUrl).toString(crypto.enc.Hex);
    return hash.substring(0, 8);
}

module.exports = router;
