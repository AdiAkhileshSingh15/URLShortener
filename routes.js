const express = require('express');
const router = express.Router();
const Url = require('./models');
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
            req.app.set('url', url.originalUrl);
            return res.redirect('/auth/google');
        }
        res.redirect(url.originalUrl);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Generate a hash for short URL
function generateHash(originalUrl) {
    const hash = crypto.SHA256(originalUrl).toString(crypto.enc.Hex);
    return hash.substring(0, 8);
}

module.exports = router;
