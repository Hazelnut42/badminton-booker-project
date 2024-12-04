// Importing the Mongoose library for interacting with the MongoDB database
const mongoose = require('mongoose');

// Define a new Mongoose schema to represent a booking in the system
const BookingSchema = new mongoose.Schema({
    // References the 'Court' model to indicate which court is being booked
    courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    // References the 'User' model to associate the booking with a specific user
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: Date,
        required: true
    },
    status: { type: String, default: 'confirmed', enum: ['confirmed', 'cancelled'] },
});

// Export the model for use in other parts of the application
// The 'Booking' model allows CRUD operations on the 'bookings' collection in the database
module.exports = mongoose.model('Booking', BookingSchema);
