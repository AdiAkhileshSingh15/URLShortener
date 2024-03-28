const passport = require('passport');
const dotenv = require('dotenv');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

module.exports = function (app) {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60
        }
    }));
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
};
