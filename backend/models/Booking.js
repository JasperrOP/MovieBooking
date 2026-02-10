const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats: [{ type: String, required: true }], // ["A1", "A2"]
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true }, // e.g. "PAY_12345"
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);