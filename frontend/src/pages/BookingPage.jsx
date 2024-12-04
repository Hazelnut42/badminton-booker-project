import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const apiUrl = config.apiUrl;

function BookingPage() {
    // Retrieve courtId from URL parameters
    const { courtId } = useParams(); 
    console.log(courtId);

    // Define state variables
    const [slots, setSlots] = useState([]); // Stores available slots for booking
    const [date, setDate] = useState(''); // Currently selected date
    const [dates, setDates] = useState([]); // Stores the upcoming 7 dates
    const [userId, setUserId] = useState(null); // Stores user ID from localStorage
    const [selectedSlot, setSelectedSlot] = useState(null); // Stores the user's selected slot
    const navigate = useNavigate(); // Used for navigation after booking

    // Fetch initial data and setup states
    useEffect(() => {
        // Retrieve user ID from localStorage
        const id = localStorage.getItem('user_id');
        setUserId(id);

        // Set the current date and calculate the next 7 days
        const today = new Date();
        const formattedDate = moment(today).format('YYYY-MM-DD');
        setDate(formattedDate);

        const upcomingDates = [];
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i);
            upcomingDates.push(moment(futureDate).format('YYYY-MM-DD'));
        }
        setDates(upcomingDates);
        console.log(upcomingDates);

        // Fetch availability data for the current date
        async function fetchAvailability() {
            const res = await axios.get(`${apiUrl}/bookings/availability`, { params: { courtId, date } });
            setSlots(res.data.availableSlots); // Update slots with the fetched data
            }
        fetchAvailability();
    }, [courtId, date]); // Re-run effect when courtId or date changes

    // Handles booking action when user selects a slot and clicks "Book Now"
    const handleBooking = async () => {
        if (!selectedSlot) return alert('Please select a time slot');  // Ensure a slot is selected
        if (!userId) return alert('User not logged in'); // Ensure the user is logged in

        const { isAvailable } = selectedSlot;
        if (!isAvailable) {
            return alert('This time slot is already booked'); // Prevent booking unavailable slots
        }

        try {
            // Make a booking request to the server
            const response = await axios.post(`${apiUrl}/bookings/book`, {
                userId,
                courtId,
                date: selectedSlot.date,
                timeSlot: `${selectedSlot.time}:00-${selectedSlot.time + 1}:00`,
            });
            // Update the UI to reflect the newly booked slot
            setSlots((prevSlots) =>
                prevSlots.map((s) =>
                    s.date === selectedSlot.date && s.time === selectedSlot.time
                        ? { ...s, isAvailable: false }
                        : s
                )
            );
            // Navigate to a confirmation page with booking details
            navigate('/confirmation', { state: { booking: response.data.booking } });
        } catch (error) {
            alert('Booking failed'); // Show an error message if the booking fails
        }
    };

    return (
        <div className="booking-page-container">
            {/* Page title */}
            <h2>Book a Slot</h2>
            {/* Display the current date in a disabled input field */}
            <label style={{
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                        }}>Today Date: </label>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                disabled
            />
            <div style={{ height: '20px' }}></div>

            {/* Table for displaying available slots */}
            <table className="slots-table">
                <thead>
                    <tr>
                        {/* Header row with dates and time slots */}
                        <th>Date</th>
                        {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((hour) => (
                            <th key={hour}>{`${hour}:00-${hour + 1}:00`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dates.map((day) => (
                        <tr key={day}>
                            {/* Display the date in the first column of each row */}
                            <td style={{
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                        }}>{day}</td>
                            {/* Display time slots for each date */}
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((hour) => {
                                const slot = slots.find(slot => slot.date === day && slot.time === hour);
                                    return (
                                        <td key={hour}>
                                        {/* Check if the slot is available, not available, or loading */}
                                        {slot ? (
                                            slot.isAvailable ? (
                                                <button
                                                    style={{
                                                        backgroundColor: selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'purple' : 'green',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => setSelectedSlot(slot)} // Update selected slot on click
                                                >
                                                    {/* Button text changes if the slot is selected */}
                                                    {selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'Selected' : 'Available'}
                                                </button>
                                            ) : (
                                                <button
                                                    style={{
                                                        backgroundColor: 'gray', // Gray for unavailable slots
                                                        color: 'white',
                                                        cursor: 'not-allowed', // Disable pointer interaction
                                                    }}
                                                    disabled
                                                >
                                                    Not Available
                                                </button>
                                            )
                                        ) : (
                                            'Loading...' // Display while the slot data is loading
                                        )}
                                    </td>
                                    );
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Button to confirm the booking */}
            <button 
                onClick={handleBooking} // Trigger the booking handler
                style={{
                    marginTop: '20px',
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '10px 20px',
                    cursor: 'pointer'
                }}
            >
                Book Now
            </button>
        </div>
    );
}


export default BookingPage;
