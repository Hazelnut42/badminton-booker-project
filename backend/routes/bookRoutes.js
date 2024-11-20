const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Court = require('../models/courts');
const moment = require('moment');

// Create booking
router.post('/book', async (req, res) => {
    const { userId, courtId, date, timeSlot } = req.body;

    try {
        // Convert date to a Date object
        const parsedDate = moment(date).local().toDate(); // e.g., "2024-11-19"

        // Parse timeSlot, assuming timeSlot is "8:00-9:00"
        const timeParts = timeSlot.split('-')[0].split(':'); // "8:00" -> ["8", "00"]
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        // Create a full Date object for timeSlot using the year, month, and day from date
        const timeSlotDate = new Date(parsedDate);
        timeSlotDate.setHours(hours, minutes, 0, 0); // Set hours and minutes to 8:00 AM

        // Create a new booking object
        const newBooking = new Booking({
            userId,
            courtId,
            date: new Date(), // Store the current date
            timeSlot: timeSlotDate // Store the full time slot
        });

        await newBooking.save(); // Save to the database
        const court = await Court.findById(courtId);
        const bookingData = {
            userId,          // User ID
            courtId,         // Court ID
            date: date,      // Current date
            timeSlot: timeSlot, // Booked time
            courtName: court.name, // Court name
            courtLocation: court.address, // Court location
        };
        res.status(201).json({ message: 'Booking successful', booking: bookingData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating booking', message: err.message });
    }
});

// Get booking history
router.get('/history/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate('courtId');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching booking history' });
    }
});

// Cancel booking
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

// Check court availability
router.get('/availability', async (req, res) => {
    const { courtId, date } = req.query; // Get courtId and date from request query

    // If date is not provided, use today's date
    const targetDate = date ? moment(date).startOf('day') : moment().startOf('day');

    // Calculate availability for the next 6 days
    const availability = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = targetDate.clone().add(i, 'days'); // Add i days to the target date

        // Collect all time slots for each day (from 8:00 AM to 10:00 PM)
        const timeSlots = [];
        for (let hour = 8; hour < 22; hour++) {
            const timeSlot = currentDate.clone().set('hour', hour).set('minute', 0).toDate();
            timeSlots.push(timeSlot);
        }

        // Find all confirmed bookings for the courtId within the next 7 days
        const bookedSlots = await Booking.find({
            courtId,
            timeSlot: { $in: timeSlots },
            status: 'confirmed' // Filter for confirmed bookings only
        });

        // Build availability for the current date
        timeSlots.forEach((slot) => {
            const slotHour = slot.getHours(); // Get the hour part
            const isBooked = bookedSlots.some((booking) => {
                // Mark the slot as booked if any booking matches the hour
                return moment(booking.timeSlot).isSame(slot, 'hour');
            });

            availability.push({
                date: currentDate.format('YYYY-MM-DD'),
                time: slotHour,
                isAvailable: !isBooked, // Mark as available if not booked
            });
        });
    }

    // Return availability for all time slots
    res.json({ availableSlots: availability });
});

module.exports = router;