const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    passReqToCallback: true, // This means the callback will receive the req object
    callbackURL: "/auth/google/callback"
}, (req, accessToken, refreshToken, profile, done) => { // Note the addition of req here
    const { id, emails } = profile;
    const email = emails[0].value;

    User.findByGoogleId(id, (err, existingUser) => {
        if (err) return done(err);

        if (existingUser) {
            console.log(accessToken);
            return done(null, existingUser);
        } else {
            User.create(id, email, accessToken, refreshToken, true, (err, newUser) => {
                if (err) return done(err);
                
                User.accessToken = accessToken;
                return done(null, newUser);
            });
        }
    });
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    const { id, username } = profile;
    const email = profile.emails ? profile.emails[0].value : `${username}@github.com`; // GitHub doesn't always return email

    User.findByGitHubId(id, (err, existingUser) => {
        if (err) return done(err);

        if (existingUser) {
            return done(null, existingUser);
        } else {
            User.create(id, email, accessToken, refreshToken, false, (err, newUser) => {
                if (err) return done(err);
                return done(null, newUser);
            });
        }
    });
}));

module.exports = passport;
