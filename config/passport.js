const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    const { id, emails } = profile;
    const email = emails[0].value;

    User.findByGoogleId(id, (err, existingUser) => {
        if (err) return done(err);

        if (existingUser) {
            // User already exists in the database
            return done(null, existingUser);
        } else {
            // Create a new user in the database
            User.create(id, email, accessToken, refreshToken, (err, newUser) => {
                if (err) return done(err);
                return done(null,  { id, email });
            });
        }
    });
}));

passport.serializeUser((user, done) => {
    console.log("Serialize User: ", user);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("Deserialize User ID: ", id);
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
