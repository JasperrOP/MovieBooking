const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Screen = require('../models/Screen');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { showtimeId, seats, paymentId } = req.body; 

  try {
    const show = await Showtime.findById(showtimeId).populate('screen'); 

    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }

    // 1. Conflict Check (Prevent Double Booking)
    const isConflict = show.bookedSeats.some(bookedSeat => 
      seats.includes(bookedSeat)
    );

    if (isConflict) {
      res.status(400); 
      throw new Error('One or more seats have just been booked!');
    }

    // 2. Calculate Price
    let calculatedTotal = 0;
    seats.forEach(seatLabel => {
      const rowLabel = seatLabel.charAt(0); 
      const rowConfig = show.screen.seatConfiguration.find(r => r.rowLabel === rowLabel);
      if (rowConfig) {
        calculatedTotal += rowConfig.price;
      } else {
        calculatedTotal += show.price; 
      }
    });

    // 3. Update Show (Lock Seats)
    seats.forEach(seat => {
      show.bookedSeats.push(seat);
    });
    await show.save();

    // 4. Create Booking Record
    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      seats,
      totalAmount: calculatedTotal,
      paymentId
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get booking by ID (For Receipt)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster' },
          { path: 'theatre', select: 'name location' },
          { path: 'screen', select: 'name' }
        ]
      });

    if (booking) {
      res.json(booking);
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin Dashboard)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'theatre', select: 'name' },
          { path: 'screen', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createBooking, 
  getBookingById, 
  getAllBookings 
};