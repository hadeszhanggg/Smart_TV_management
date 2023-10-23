// routes/index.js
const express = require('express');
const router = express.Router();

// Route for Admin Dashboard
router.get('../views/admin', (req, res) => {
    // Replace this with the actual rendering of the Admin Dashboard
    res.send('Admin Dashboard');
});

// Route for Client Page
router.get('../views/client', (req, res) => {
    // Replace this with the actual rendering of the Client Page
    res.send('Client Page');
});

module.exports = router;
