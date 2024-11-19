import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookingPage.css';

function BookingPage({ courtId, userId }) {
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [date, setDate] = useState('');
    const [hourlyRate, setHourlyRate] = useState(0);

    useEffect(() => {
        async function fetchCourtDetails() {
            const courtRes = await axios.get(`/api/courts/${courtId}`);
            setHourlyRate(courtRes.data.hourlyRate);
        }
        fetchCourtDetails();
    }, [courtId]);

    useEffect(() => {
        if (date) {
            async function fetchAvailability() {
                const res = await axios.get(`/api/bookings/availability`, { params: { courtId, date } });
                setSlots(res.data.availableSlots);
            }
            fetchAvailability();
        }
    }, [date, courtId]);

    const handleBooking = async () => {
        if (!selectedSlot) return alert('Please select a time slot');
        const cost = hourlyRate;

        await axios.post('/api/bookings', {
            userId,
            courtId,
            date,
            timeSlot: selectedSlot,
            cost,
        });

        alert('Booking successful!');
    };

    return (
        <div>
            <h2>Book a Slot</h2>
            <label>Date: </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            <div>
                {slots.map(slot => (
                    <button
                        key={slot}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot.time)}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
            <button onClick={handleBooking}>Book Now</button>
        </div>
    );
}

export default BookingPage;
