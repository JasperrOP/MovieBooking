const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { showtimeId, seats, totalAmount, paymentId } = req.body;

  try {
    // 1. START TRANSACTION (Logic Check)
    const show = await Showtime.findById(showtimeId);

    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }

    // 2. THE SECURITY CHECK (Prevents Double Booking)
    // Check if ANY of the requested seats are already in the 'bookedSeats' array
    const isConflict = show.bookedSeats.some(bookedSeat => 
      seats.includes(bookedSeat.type)
    );

    if (isConflict) {
      res.status(400); // Bad Request
      throw new Error('One or more seats have just been booked by someone else! Please select different seats.');
    }

    // 3. IF SAFE: Book the seats
    // Push new seats to the Showtime document
    seats.forEach(seat => {
      show.bookedSeats.push({ type: seat });
    });
    await show.save(); // This "Locks" them in the DB

    // 4. Create Receipt
    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      seats,
      totalAmount,
      paymentId
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createBooking };