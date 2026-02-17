const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, addFoodToBooking, getBookingById } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.put('/:id/food', protect, addFoodToBooking);
router.get('/:id', protect, getBookingById); // <--- This was missing!

module.exports = router;