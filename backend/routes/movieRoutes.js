const express = require('express');
const router = express.Router();
const { getAllMovies, getMovieById, deleteMovie, updateMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllMovies);
router.route('/:id').get(getMovieById).delete(protect, admin, deleteMovie).put(protect, admin, updateMovie);;

module.exports = router;