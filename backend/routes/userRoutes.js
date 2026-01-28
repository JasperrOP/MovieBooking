const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

// NOTICE: We use '/' here, not '/api/users/register'
// Because server.js already adds '/api/users'
router.post('/register', registerUser); 
router.post('/login', authUser);

module.exports = router;