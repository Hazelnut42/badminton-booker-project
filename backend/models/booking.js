const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
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

module.exports = mongoose.model('Booking', BookingSchema);
