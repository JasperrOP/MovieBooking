const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');

// @desc    Add a new movie
// @route   POST /api/admin/movies
// @access  Private/Admin
const addMovie = async (req, res) => {
  const { title, description, duration, genre, language, releaseDate, posterUrl } = req.body;

  const movie = new Movie({
    title,
    description,
    duration,
    genre,
    language,
    releaseDate,
    posterUrl,
  });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
};

// @desc    Add a new theatre
// @route   POST /api/admin/theatres
// @access  Private/Admin
const addTheatre = async (req, res) => {
  const { name, location, city, isActive } = req.body;

  const theatre = new Theatre({
    name,
    location,
    city,
    owner: req.user._id, // The admin creating it becomes the owner
    isActive,
  });

  const createdTheatre = await theatre.save();
  res.status(201).json(createdTheatre);
};

// @desc    Add a screen to a theatre
// @route   POST /api/admin/screens
// @access  Private/Admin
const addScreen = async (req, res) => {
  const { name, theatreId, city, seatConfiguration } = req.body;

  // 1. Verify the theatre exists
  const theatre = await Theatre.findById(theatreId);
  if (!theatre) {
    res.status(404);
    throw new Error('Theatre not found');
  }

  // 2. Create the screen
  const screen = new Screen({
    name,
    theatre: theatreId,
    city,
    seatConfiguration,
  });

  const createdScreen = await screen.save();
  res.status(201).json(createdScreen);
};

module.exports = { addMovie, addTheatre, addScreen };