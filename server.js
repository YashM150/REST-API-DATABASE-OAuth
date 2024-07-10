const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},

function(token, tokenSecret, profile, done) {
    const { id, emails } = profile;
    const email = emails[0].value;

    db.query('SELECT * FROM users WHERE google_id = ?', [id], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) {
            done(null, results[0]);
        } else {
            db.query('INSERT INTO users (google_id, email, access_token, refresh_token) VALUES (?, ?, ?, ?)', [id, email, token, tokenSecret], (err, results) => {
                if (err) return done(err);
                done(null, { id: results.insertId, google_id: id, email, access_token: token, refresh_token: tokenSecret });
            });
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return done(err);
        done(null, results[0]);
    });
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    (req, res) => {
        res.redirect('/api/data1');
    }
);

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Example routes
app.get('/api/data1', ensureAuthenticated, (req, res) => {
    res.json({ message: 'GET request 1' });
});

app.get('/api/data2', ensureAuthenticated, (req, res) => {
    res.json({ message: 'GET request 2' });
});

app.post('/api/enteruserinfo', ensureAuthenticated, (req, res) => {
    const {name,email,bloodgroup,gender}=req.body;
    console.log(name);
    console.log(gender);
    console.log(bloodgroup);
    return db.query('INSERT INTO demo ( name, email, bloodgroup,gender) VALUES (?, ?, ?, ?);',[name,email,bloodgroup,gender], (err, result) => {
        if (err) {
          console.error('Error during user creation:', err);
          return res.status(500).send('Error Adding a particular user!');
        }
        res.status(200).json('User added!');
      })
});

app.put('/api/data', ensureAuthenticated, (req, res) => {
    res.json({ message: 'PUT request' });
});

app.patch('/api/data', ensureAuthenticated, (req, res) => {
    res.json({ message: 'PATCH request' });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
