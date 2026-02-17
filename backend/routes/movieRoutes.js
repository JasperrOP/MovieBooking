const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, deleteMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllMovies);
router.route('/:id').get(getMovieById).delete(protect, admin, deleteMovie);

module.exports = router;