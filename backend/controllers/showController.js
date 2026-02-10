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

// @desc    Get shows for a specific movie with Dynamic Pricing
// @route   GET /api/shows/movie/:id
const getShowsForMovie = async (req, res) => {
  const movieId = req.params.id;

  // 1. Find shows and get full details of Theatre and Screen
  const shows = await Showtime.find({ movie: movieId })
    .populate('theatre', 'name location city')
    .populate('screen', 'name seatConfiguration');

  // 2. Apply Dynamic Pricing Algorithm
  const showsWithDynamicPrice = shows.map(show => {
    // Calculate Occupancy
    const totalSeats = show.screen.seatConfiguration.reduce((acc, row) => acc + row.seatCount, 0);
    const bookedCount = show.bookedSeats.length;
    const occupancy = bookedCount / totalSeats;

    // Calculate Time Remaining
    const now = new Date();
    const showTime = new Date(show.startTime);
    const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);

    let finalPrice = show.price;
    let isDynamic = false;

    // RULE: If show is soon (< 2 hours) AND empty (< 50%), give 20% Discount
    if (hoursUntilShow > 0 && hoursUntilShow < 2 && occupancy < 0.5) {
      finalPrice = show.price * 0.8;
      isDynamic = true;
    }

    return {
      ...show.toObject(),
      originalPrice: show.price,
      price: Math.round(finalPrice), // Send the discounted price
      isDynamicDeal: isDynamic       // Frontend can show a "Deal!" badge
    };
  });

  res.json(showsWithDynamicPrice);
};

module.exports = { addShowtime, getShowsForMovie };