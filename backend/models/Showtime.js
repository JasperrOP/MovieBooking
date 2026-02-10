const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  // ... (keep other fields like movie, theatre, screen, startTime, price same) ...
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  startTime: { type: Date, required: true },
  price: { type: Number, required: true },

  // --- CHANGE THIS SECTION ---
  bookedSeats: [
    {
      type: String, // This defines an array of Strings: ["A1", "B2"]
    }
  ]
  // ---------------------------

}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);