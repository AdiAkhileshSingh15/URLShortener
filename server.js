const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const nodemailer = require('nodemailer');
const config = require('./config');
require('dotenv').config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60
    }
}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    return done(null, email);
}));

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect(`/confirm?email=${req.user}`);
    }
);

app.get('/confirm', async (req, res) => {
    try {
        const { email } = req.query;
        const url = req.app.get('url');
        req.app.set('url', null);
        sendConfirmationEmail(email, url);
        res.send('Confirmation email sent');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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

app.use('/api/url', require('./routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
