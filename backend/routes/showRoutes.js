const express = require('express');
const router = express.Router();
const { addShowtime, getShowsForMovie } = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: Anyone can see shows (and get the dynamic price)
router.get('/movie/:id', getShowsForMovie);

// Admin: Only admins can create shows
router.post('/', protect, admin, addShowtime);

module.exports = router;