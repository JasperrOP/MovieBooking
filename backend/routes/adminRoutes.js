const express = require('express');
const router = express.Router();
const { addMovie, addTheatre, addScreen, getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All these routes are protected (Must be Login + Admin)
router.post('/movies', protect, admin, addMovie);
router.post('/theatres', protect, admin, addTheatre);
router.post('/screens', protect, admin, addScreen);

// New Analytics Route
router.get('/stats', protect, admin, getAdminStats);

module.exports = router;