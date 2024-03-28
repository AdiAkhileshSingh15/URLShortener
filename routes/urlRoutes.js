const express = require('express');
const router = express.Router();

const urlControllers = require('../controllers/urlControllers');

router.post('/', urlControllers.createUrl);

router.get('/:shortUrl', urlControllers.shortUrl);

module.exports = router;
