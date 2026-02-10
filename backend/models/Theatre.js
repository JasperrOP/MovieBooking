const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true, // e.g., "Downtown Mall, 3rd Floor"
  },
  city: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User model
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true, // Admin can temporarily close a theatre
  }
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);