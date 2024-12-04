require('dotenv').config({ path: '../.env' }); // Load .env file
const express = require('express');
const cors = require('cors'); //to handle cross-origin requests
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const courtsRoutes = require('./routes/courtsRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db'); // Database connection
const seedDatabase = require('./seed'); // Import seed data script
const fs = require('fs');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;

// Check the contents of the frontend build directory (for debugging purposes)
const buildDir = path.join(__dirname, '../frontend/build');
fs.readdir(buildDir, (err, files) => {
    if (err) {
        console.error('Error reading build directory:', err);
    } else {
        console.log('Files in frontend/build:', files);
    }
});

// Connect to the database and initialize seed data
connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        // Initialize seed data (uncomment if needed)
        // seedDatabase(); // Uncomment as required
    })
    .catch(error => console.error('Error connecting to MongoDB:', error.message));

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON payloads


// Serve static image files
app.use('/images', express.static(path.join(__dirname, 'images')));
// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/bookings', bookingsRoutes);


// Serve React frontend build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build'))); // Serve static files

    // For all other routes, return the React app's index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});