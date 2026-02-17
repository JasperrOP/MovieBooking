const express = require('express');
const router = express.Router();
const { addShowtime, getShowsForMovie, getAllShows, deleteShow } = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public: Get shows for a movie
router.get('/movie/:id', getShowsForMovie);

// Admin Routes
router.route('/').post(protect, admin, addShowtime).get(getAllShows); // Added GET for admin list
router.route('/:id').delete(protect, admin, deleteShow); // Added DELETE

module.exports = router;