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
    callbackURL: "/auth/google/callback"
}, (req, accessToken, refreshToken, profile, done) => {
    const { id, emails } = profile;
    const email = emails[0].value;

    User.findByGoogleId(id, (err, existingUser) => {
        if (err) return done(err);
        if (existingUser) {
            accessToken = existingUser.access_token;
            console.log('existing user:',existingUser);
            console.log('Existing user, accessToken:', existingUser.access_token);
            return done(null, existingUser);
        } else {
            console.log('refresh token_passport:',refreshToken.access_token);
            User.create(id, email, refreshToken.access_token, refreshToken.id_token, true, (err, newUser) => {
                if (err) return done(err);
                console.log('New user created, accessToken:', newUser.accessToken);
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
