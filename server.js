const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const passport = require('./config/passport');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(cors({
    origin: 'http://localhost:3000',  // Update this with your frontend URL
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { 
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] 
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }), (req, res) => {
        console.log('AccessToken:', req.user.accessToken); // Debug
        // Save access token in a cookie
        res.cookie('accessToken', req.user.accessToken, { httpOnly: true });
        res.redirect('http://localhost:3001');
    }
);

app.post('/auth/token', (req, res) => {
    // Handle token logic if necessary
});

// Use GET temporarily for debugging
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) { return next(err); }
            res.clearCookie('connect.sid'); // Adjust this if you use a different cookie name
            res.redirect('/');
        });
    });
});

// Use userRoutes for the '/api' path
app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
