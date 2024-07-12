const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ensureAuthenticated = async (req, res, next) => {
    
    try {
        const token = req.cookies['access_token'];
        console.log(token);
        if (!token) {
        return res.status(401).send('Unauthorized');
    }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        req.user = payload;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send('Unauthorized');
    }
};

module.exports = { ensureAuthenticated };
