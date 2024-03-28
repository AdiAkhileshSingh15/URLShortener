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
        const createdBy = req.app.get('createdBy');
        req.app.set('url', null);
        req.app.set('createdBy', null);
        sendMail(createdBy, 'URL Access Confirmation', `Your URL ${url} has been accessed by ${email}`);
        sendMail(email, 'Original URL', `Here is the URL your requested: ${url}`);
        res.send('Confirmation email sent');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}