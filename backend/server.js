require('dotenv').config({ path: '../.env' }); // Load .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const courtsRoutes = require('./routes/courtsRoutes');
const bookingsRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db'); // Database connection
const seedDatabase = require('./seed'); // Import seed data script
const fs = require('fs');

const app = express(); // Initialize app
const PORT = process.env.PORT || 5001;

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

// Middleware
app.use(cors());
app.use(express.json());



// Root route
// app.get('/', (req, res) => {
//     res.send('Welcome to the server!');
// });
// Serve static image files
app.use('/images', express.static(path.join(__dirname, 'images')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/bookings', bookingsRoutes);


// Serve static files from React build folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // For all routes, send back the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});