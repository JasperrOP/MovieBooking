const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes'); // Ensure this file exists!

// 1. Load Config
dotenv.config({ path: path.join(__dirname, '.env') });

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
app.use(express.json()); // Essential for reading JSON bodies
app.use(cors()); 

// 4. Routes
// This tells the server: "Any URL starting with /api/users, go to userRoutes"
app.use('/api/users', userRoutes);

// 5. Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});