const fetch = require('node-fetch');
const passport = require('passport');
const User = require('../models/userModel');

const ensureAuthenticated = async (req, res, next) => {
    const token = req.cookies['accessToken'];
    console.log('Token:', token);
    try {
        if (!token) {
            return res.status(401).send('Unauthorized');
        }

        // Verify the access token
        User.findByAccessToken(token, (err, user) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(500).send('Internal Server Error');
            }
            if (!user) {
                return res.status(401).send('Unauthorized');
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send('Unauthorized');
    }
};

module.exports = { ensureAuthenticated };
