const express = require('express');
const router = express.Router();
const { createBooking, getBookingById, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/all', protect, admin, getAllBookings); // <--- Admin Route
router.get('/:id', protect, getBookingById);

module.exports = router;