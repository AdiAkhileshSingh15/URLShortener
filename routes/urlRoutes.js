const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const urlControllers = require('../controllers/urlControllers');

router.post('/',
    [
        check('originalUrl', 'Please include a valid URL').isURL(),
        check('requiresLogin', 'Please include a valid requiresLogin').isBoolean(),
        check('expirationDate', 'Please include a valid expirationDate').custom((value) => {
            const now = new Date().toISOString();
            if (new Date(value) <= new Date(now)) {
                throw new Error('Expiration date must be in the future');
            }
            return true;
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        },
        check('createdBy', 'Please include a valid createdBy').isEmail(),
    ],
    urlControllers.createUrl
);

router.get('/:shortUrl', urlControllers.shortUrl);

module.exports = router;
