const Url = require('../models/url');

const { generateHash } = require('../utils/hash');

exports.createUrl = async (req, res) => {
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
};

exports.shortUrl = async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (!url) {
            return res.status(404).json({ msg: 'URL not found' });
        }
        if (url.expirationDate && url.expirationDate < Date.now()) {
            return res.status(400).json({ msg: 'URL has expired' });
        }
        if (url.requiresLogin) {
            req.app.set('url', url.originalUrl);
            req.app.set('createdBy', url.createdBy);
            return res.redirect('/auth/google');
        }
        res.redirect(url.originalUrl);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
