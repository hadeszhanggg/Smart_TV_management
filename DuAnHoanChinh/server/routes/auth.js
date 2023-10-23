// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Login successful' });
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
