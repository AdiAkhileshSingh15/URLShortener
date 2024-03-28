const passport = require("passport")

const { sendMail } = require('../utils/nodemailer');

exports.OAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.OAuthCallback = passport.authenticate('google', { failureRedirect: '/auth/google' });

exports.redirectConfirm = (req, res) => {
    res.redirect(`/auth/confirm?email=${req.user}`);
}

exports.confirm = async (req, res) => {
    try {
        const { email } = req.query;
        const url = req.app.get('url');
        req.app.set('url', null);
        sendMail(email, url);
        res.send('Confirmation email sent');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}