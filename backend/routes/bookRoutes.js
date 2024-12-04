const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Court = require('../models/courts');
const moment = require('moment');

// First Route: Create a new booking
router.post('/book', async (req, res) => {
    // Destructure required fields from the request body
    const { userId, courtId, date, timeSlot } = req.body;

    try {
        // Parse and process the date input into a JavaScript Date object
        const parsedDate = moment(date).local().toDate(); // e.g., "2024-11-19"

        // Parse the timeSlot input to extract hours and minutes
        const timeParts = timeSlot.split('-')[0].split(':'); // "8:00" -> ["8", "00"]
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);

        // Create a Date object for the time slot using the parsed date, hours, and minutes
        const timeSlotDate = new Date(parsedDate);
        timeSlotDate.setHours(hours, minutes, 0, 0); // Set hours and minutes to 8:00 AM

        // Initialize a new booking with the provided data
        const newBooking = new Booking({
            userId,
            courtId,
            date: new Date(), // Store the current date
            timeSlot: timeSlotDate // Store the specific time slot
        });
        // Save the booking to the database
        await newBooking.save();

        // Retrieve court details for additional information
        const court = await Court.findById(courtId);
        // Format the booking response data
        const bookingData = {
            userId,
            courtId,
            date: date,
            timeSlot: timeSlot,
            courtName: court.name,
            courtLocation: court.address,
        };
        res.status(201).json({ message: 'Booking successful', booking: bookingData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating booking', message: err.message });
    }
});

// Second Route: Retrieve booking history for a specific user
router.get('/history/:userId', async (req, res) => {
    try {
        // Query the database for bookings by the userId and populate court details
        const bookings = await Booking.find({ userId: req.params.userId }).populate('courtId');
        // Send the user's booking history as a response
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching booking history' });
    }
});

// Third Route: Cancel an existing booking
router.delete('/:id', async (req, res) => {
    try {
        // Find the booking by its unique ID
        const booking = await Booking.findById(req.params.id);

        // Check if the booking exists and has not already been cancelled
        if (!booking || booking.status === 'cancelled') {
            return res.status(404).json({ error: 'Booking not found or already cancelled' });
        }

        // Update the booking status to 'cancelled'
        booking.status = 'cancelled';
        await booking.save();

        // Send a success response with the updated booking
        res.json({ message: 'Booking cancelled', booking });
    } catch (err) {
        res.status(500).json({ error: 'Error cancelling booking' });
    }
});

// Forth Route: Check court availability
router.get('/availability', async (req, res) => {
    // Get courtId and date from request query
    const { courtId, date } = req.query;

    // Use the provided date or default to today's date, and set it to the start of the day
    const targetDate = date ? moment(date).startOf('day') : moment().startOf('day');

    // Initialize an array to store availability data
    const availability = [];
    // Calculate availability for the next 6 days
    for (let i = 0; i < 7; i++) {
        const currentDate = targetDate.clone().add(i, 'days');

        // Collect all time slots for each day (from 8:00 AM to 10:00 PM)
        const timeSlots = [];
        for (let hour = 8; hour < 22; hour++) {
            const timeSlot = currentDate.clone().set('hour', hour).set('minute', 0).toDate();
            timeSlots.push(timeSlot);
        }

        // Find all confirmed bookings for the courtId within the next 6 days
        const bookedSlots = await Booking.find({
            courtId,
            timeSlot: { $in: timeSlots },
            status: 'confirmed'
        });

        // Build the availability response by checking each slot against booked slots
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

    // Send the calculated availability as a response
    res.json({ availableSlots: availability });
});

module.exports = router;