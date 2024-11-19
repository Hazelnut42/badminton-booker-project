const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// create booking
router.post('/', async (req, res) => {
    const { userId, courtId, date, timeSlot, cost } = req.body;

    try {
        const existingBooking = await Booking.findOne({ courtId, date, timeSlot, status: 'confirmed' });

        if (existingBooking) {
            return res.status(400).json({ error: 'Slot already booked' });
        }

        const newBooking = new Booking({ userId, courtId, date, timeSlot, cost });
        await newBooking.save();

        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (err) {
        res.status(500).json({ error: 'Error creating booking' });
    }
});

// get booking history
router.get('/history/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('courtId');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching booking history' });
    }
});

// cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking || booking.status === 'cancelled') {
            return res.status(404).json({ error: 'Booking not found or already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
        res.status(500).json({ error: 'Error cancelling booking' });
    }
});

module.exports = router;
