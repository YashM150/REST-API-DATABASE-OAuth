const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const passport = require('./config/passport');
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

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }), (req, res) => {
        res.redirect('/api/data1');
    });

// Use userRoutes for the '/api' path
app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
