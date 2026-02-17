const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Screen = require('../models/Screen');
const Booking = require('../models/Booking');
const User = require('../models/User');

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
  // Add hasFoodService to the destructured body
  const { name, location, city, isActive, hasFoodService } = req.body;

  const theatre = new Theatre({
    name,
    location,
    city,
    owner: req.user._id,
    isActive,
    hasFoodService: hasFoodService || false // Default to false if not sent
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

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // 1. Total Sales
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // 2. Total Counts
    const totalBookings = await Booking.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();

    // 3. Recent Bookings (Deep Populate to get Movie Title)
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate({
        path: 'showtime',
        populate: {
          path: 'movie', // This assumes Showtime model has 'movie' field
          select: 'title'
        }
      });

    res.json({
      revenue: totalRevenue[0]?.total || 0,
      bookings: totalBookings,
      movies: totalMovies,
      users: totalUsers,
      recentBookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  addMovie, 
  addTheatre, 
  addScreen, 
  getAdminStats 
};