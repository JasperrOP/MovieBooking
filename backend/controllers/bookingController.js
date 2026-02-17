const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  const { showtimeId, seats, paymentId, foodItems, totalAmount } = req.body;

  try {
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      seats,
      paymentId,
      totalAmount,
      foodItems: foodItems || [],
      foodStatus: foodItems && foodItems.length > 0 ? 'Pending' : 'None'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Booking By ID (For Receipt)
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title posterUrl' },
          { path: 'theatre', select: 'name location' },
          { path: 'screen', select: 'name' }
        ]
      });

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'showtime',
        populate: {
          path: 'theatre',
          select: 'name hasFoodService'
        }
      })
      .populate({
        path: 'showtime',
        populate: { path: 'movie', select: 'title' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Food to existing Booking
// @route   PUT /api/bookings/:id/food
const addFoodToBooking = async (req, res) => {
  const { foodItems, totalPrice } = req.body; 

  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.foodItems = [...booking.foodItems, ...foodItems];
      if (booking.foodStatus === 'None' || booking.foodStatus === 'Delivered') {
        booking.foodStatus = 'Pending';
      }
      booking.totalAmount += totalPrice;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, addFoodToBooking, getBookingById };