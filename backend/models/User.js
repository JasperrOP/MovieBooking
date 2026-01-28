const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'theatre_staff'], 
    default: 'user', 
  },
  phone: {
    type: String,
    required: false,
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

// --- ENCRYPTION MIDDLEWARE ---
// This function runs automatically BEFORE (.pre) the user is saved (.save) to the DB.
userSchema.pre('save', async function (next) {
  // If the password field hasn't been modified (e.g., we are just updating the phone number),
  // skip encryption. We don't want to double-encrypt an already encrypted password.
  if (!this.isModified('password')) {
    next();
  }

  // Generate a "salt". This adds random data to the password so that 
  // "password123" doesn't always look the same in the database.
  const salt = await bcrypt.genSalt(10);
  
  // Replace the plain text password with the hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// --- HELPER METHOD ---
// We add a custom method to compare passwords later during Login.
// enteredPassword = what user typed. this.password = the encrypted one in DB.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);