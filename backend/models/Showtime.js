const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  startTime: { type: Date, required: true },
  price: { type: Number, required: true },

  // --- FIX: Store seats as a simple array of Strings ---
  bookedSeats: [String] 
  // Example data in DB: ["A1", "A2", "B5"]
  // ----------------------------------------------------

}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);