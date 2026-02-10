const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // e.g., "Screen 1", "IMAX Hall"
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  // We define rows to build the visual grid later
  seatConfiguration: [
    {
      rowLabel: { type: String, required: true }, // e.g., "A"
      seatCount: { type: Number, required: true }, // e.g., 10 seats in this row
      price: { type: Number, required: true }, // Standard price for this row (e.g., 150)
      seatType: { 
          type: String, 
          enum: ['Standard', 'Premium', 'Recliner'], 
          default: 'Standard' 
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Screen', screenSchema);