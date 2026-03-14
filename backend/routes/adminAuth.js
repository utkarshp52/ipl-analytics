const express = require('express');
const router = express.Router();
const { login, logout, checkAuth } = require('../controllers/adminAuthController');

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Check auth status
router.get('/check', checkAuth);

module.exports = router;