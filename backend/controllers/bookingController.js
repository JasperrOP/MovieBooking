const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Screen = require('../models/Screen'); // <-- 1. IMPORT SCREEN MODEL

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { showtimeId, seats, paymentId } = req.body; // Remove 'totalAmount' from body (we calculate it here)

  try {
    // 1. Get the Showtime and populate the Screen details
    const show = await Showtime.findById(showtimeId).populate('screen'); 

    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }

    // 2. THE SECURITY CHECK (Prevents Double Booking)
    const isConflict = show.bookedSeats.some(bookedSeat => 
      seats.includes(bookedSeat.type)
    );

    if (isConflict) {
      res.status(400); 
      throw new Error('One or more seats have just been booked!');
    }

    // 3. CALCULATE DYNAMIC PRICE SERVER-SIDE
    let calculatedTotal = 0;

    seats.forEach(seatLabel => {
      // Assuming seat format is "A1", "B2" etc.
      // We extract the Row Label (e.g., "A")
      const rowLabel = seatLabel.charAt(0); 

      // Find the row in the Screen's configuration
      const rowConfig = show.screen.seatConfiguration.find(
        row => row.rowLabel === rowLabel
      );

      if (rowConfig) {
        calculatedTotal += rowConfig.price; // Use the SCREEN price, not the showtime price
      } else {
        // Fallback if row not found (or use show.price as default)
        calculatedTotal += show.price; 
      }
    });

    // 4. Book the seats
    seats.forEach(seat => {
      show.bookedSeats.push({ type: seat });
    });
    await show.save();

    // 5. Create Receipt with the CALCULATED amount
    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      seats,
      totalAmount: calculatedTotal, // <-- Use the secure, calculated amount
      paymentId
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createBooking };