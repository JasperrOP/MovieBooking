const mongoose = require('mongoose');

// The connectDB function is 'async' because connecting to a database takes time 
// and we don't want to block the rest of the code while waiting.
const connectDB = async () => {
  try {
    // Attempt to connect using the URI stored in your .env file
   const conn = await mongoose.connect('mongodb://127.0.0.1:27017/moviebooking');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // If connection fails, stop the server immediately (process.exit(1))
    // There is no point in running the server if the DB is down.
    process.exit(1);
  }
};

module.exports = connectDB;