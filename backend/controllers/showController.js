const Showtime = require('../models/Showtime');

// @desc    Add a new showtime (Admin only)
// @route   POST /api/shows
const addShowtime = async (req, res) => {
  const { movieId, theatreId, screenId, startTime, price } = req.body;

  const showtime = new Showtime({
    movie: movieId,
    theatre: theatreId,
    screen: screenId,
    startTime,
    price,
  });

  await showtime.save();
  res.status(201).json(showtime);
};

// @desc    Get all shows (For Admin Dashboard)
// @route   GET /api/shows
const getAllShows = async (req, res) => {
  try {
    const shows = await Showtime.find({})
      .populate('movie', 'title')
      .populate('theatre', 'name')
      .populate('screen', 'name');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shows for a specific movie with Dynamic Pricing
// @route   GET /api/shows/movie/:id
const getShowsForMovie = async (req, res) => {
  const movieId = req.params.id;

  const shows = await Showtime.find({ movie: movieId })
    .populate('theatre', 'name location city')
    .populate('screen', 'name seatConfiguration');

  const showsWithDynamicPrice = shows.map(show => {
    const totalSeats = show.screen.seatConfiguration.reduce((acc, row) => acc + row.seatCount, 0);
    const bookedCount = show.bookedSeats.length;
    const occupancy = bookedCount / totalSeats;

    const now = new Date();
    const showTime = new Date(show.startTime);
    const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);

    let finalPrice = show.price;
    let isDynamic = false;

    if (hoursUntilShow > 0 && hoursUntilShow < 2 && occupancy < 0.5) {
      finalPrice = show.price * 0.8;
      isDynamic = true;
    }

    return {
      ...show.toObject(),
      originalPrice: show.price,
      price: Math.round(finalPrice),
      isDynamicDeal: isDynamic       
    };
  });

  res.json(showsWithDynamicPrice);
};

// @desc    Delete a showtime
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res) => {
  try {
    const show = await Showtime.findById(req.params.id);
    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Show removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addShowtime, getShowsForMovie, getAllShows, deleteShow };