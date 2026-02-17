const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  seats: [{ type: String, required: true }], // ["A1", "A2"]
  
  // --- NEW: Food Ordering Fields ---
  foodItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  foodStatus: { 
    type: String, 
    enum: ['Pending', 'Ready', 'Delivered', 'None'], 
    default: 'None' 
  },

  // --- NEW: Ticket Status for Entry ---
  ticketStatus: {
    type: String,
    enum: ['Booked', 'Scanned', 'Cancelled'],
    default: 'Booked'
  },

  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);