// models/user.js
const connection = require('../config/database');

class User {
    static findByUsername(username, callback) {
        const query = 'SELECT * FROM user WHERE username = ?';
        connection.query(query, [username], (err, result) => {
            if (err) {
                return callback(err);
            }
            return callback(null, result[0]);
        });
    }
}

module.exports = User;
