const Booking = require('../models/Booking');

// @desc    Get all food orders for the kitchen
// @route   GET /api/staff/food-orders
// @access  Private/Staff
const getFoodOrders = async (req, res) => {
  try {
    // Finds bookings that have food items and are not yet delivered
    const orders = await Booking.find({
      'foodItems.0': { $exists: true },
      foodStatus: { $ne: 'Delivered' }
    }).populate('user', 'name').populate('showtime');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update food order status
// @route   PUT /api/staff/food-orders/:id
const updateFoodStatus = async (req, res) => {
  const { status } = req.body; // e.g., 'Ready' or 'Delivered'
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      booking.foodStatus = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Ticket (Scan QR)
// @route   POST /api/staff/verify-ticket
// @access  Private/Staff
const verifyTicket = async (req, res) => {
  const { ticketId } = req.body; // The Booking ID from the QR code

  try {
    const booking = await Booking.findById(ticketId).populate('showtime').populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Invalid Ticket', valid: false });
    }

    if (booking.ticketStatus === 'Scanned') {
      return res.status(400).json({ message: 'Ticket Already Used', valid: false, booking });
    }

    // Mark as Scanned
    booking.ticketStatus = 'Scanned';
    await booking.save();

    res.json({ 
      message: 'Access Granted', 
      valid: true, 
      booking: {
        movie: booking.showtime.movieTitle || "Movie", 
        seats: booking.seats,
        user: booking.user.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getFoodOrders, updateFoodStatus, verifyTicket };