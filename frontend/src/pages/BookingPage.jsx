import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; 
import '../styles/BookingPage.css';

function BookingPage() {
    const { courtId, userId } = useParams();
    console.log(courtId, userId);

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [date, setDate] = useState('');
    const [hourlyRate, setHourlyRate] = useState(0);
    const navigate = useNavigate();

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

        try {
            const response = await axios.post('/api/bookings', {
                userId,
                courtId,
                date,
                timeSlot: selectedSlot,
                cost,
            });

            alert('Booking successful!');
            navigate('/confirmation', { state: { booking: response.data.booking } });
        } catch (error) {
            alert('Failed to book the slot');
        }
    };

    return (
        <div className="booking-page-container">
            <h2>Book a Slot</h2>
            <label>Date: </label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <div className="slots-container">
                {slots.map((slot) => (
                    <button
                        key={slot.time}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot.time)}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
            <button className="book-now-btn" onClick={handleBooking}>Book Now</button>
        </div>
    );
}

export default BookingPage;
