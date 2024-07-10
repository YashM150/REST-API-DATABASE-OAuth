const db = require('../config/db');

const User = {
    findById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) return callback(err, null);
            if (results.length > 0) {
                return callback(null, results[0]);
            } else {
                return callback(null, null);
            }
        });
    },
    findByGoogleId: (googleId, callback) => {
        db.query('SELECT * FROM users WHERE google_id = ?', [googleId], (err, results) => {
            if (err) return callback(err, null);
            if (results.length > 0) {
                return callback(null, results[0]);
            } else {
                return callback(null, null);
            }
        });
    },
    findByGitHubId: (githubId, callback) => {
        db.query('SELECT * FROM users WHERE github_id = ?', [githubId], (err, results) => {
            if (err) return callback(err, null);
            if (results.length > 0) {
                return callback(null, results[0]);
            } else {
                return callback(null, null);
            }
        });
    },
    create: (oauthId, email, accessToken, refreshToken, isGoogle, callback) => {
        const column = isGoogle ? 'google_id' : 'github_id';
        const query = `INSERT INTO users (${column}, email, access_token, refresh_token) VALUES (?, ?, ?, ?)`;
        db.query(query, [oauthId, email, accessToken, refreshToken], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, { id: results.insertId, email, accessToken, refreshToken });
        });
    },
    AddUser: ([name, email, bloodgroup, gender], callback) => {
        db.query('INSERT INTO demo (name, email, bloodgroup, gender) VALUES (?, ?, ?, ?)', [name, email, bloodgroup, gender], (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    },
    findAll: (callback) => {
        db.query('SELECT * FROM demo', (err, results) => {
            if (err) {
                console.error('Error finding all users:', err);
                return callback(err, null);
            }
            return callback(null, results);
        });
    },
    findUser: (id, callback) => {
        db.query('SELECT * FROM demo WHERE user_id = ?', [id], (err, results) => {
            if (err) {
                console.error('Error finding user by ID:', err);
                return callback(err, null);
            }
            return callback(null, results.length ? results[0] : null);
        });
    },
    deleteUser: (id, callback) => {
        db.query('DELETE FROM demo WHERE (user_id = ?)', [id], (err, result) => {
            if (err) {
                console.error('Error deleting user:', err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    },
    UpdatePartially: (id, fields, callback) => {
        const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
        const values = Object.values(fields);
        values.push(id);
        const sql = `UPDATE demo SET ${setClause} WHERE user_id = ?`;

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return callback(err, null);
            }
            return callback(null, result);
        });
    }
};

module.exports = User;
