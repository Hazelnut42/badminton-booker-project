require('dotenv').config({ path: '../.env' }); // Load .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const courtsRoutes = require('./routes/courtsRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db'); // Database connection
const seedDatabase = require('./seed'); // Import seed data script

const app = express(); // Initialize app
const PORT = process.env.PORT || 5001;

// Serve static image files
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect to the database and initialize seed data
connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        // Initialize seed data (uncomment if needed)
        // seedDatabase(); // Uncomment as required
    })
    .catch(error => console.error('Error connecting to MongoDB:', error.message));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});