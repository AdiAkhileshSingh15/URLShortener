const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers');

router.get('/google', authControllers.OAuth);

router.get('/google/callback', authControllers.OAuthCallback, authControllers.redirectConfirm);

router.get('/confirm', authControllers.confirm);

module.exports = router;
