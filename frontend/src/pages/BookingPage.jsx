import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const apiUrl = config.apiUrl;

function BookingPage() {
    const { courtId } = useParams(); // courtId will be a dynamic parameter in the URL
    console.log(courtId); // Log courtId to ensure it's correct
    const [slots, setSlots] = useState([]);
    const [date, setDate] = useState('');
    const [dates, setDates] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('user_id');
        setUserId(id);
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
    }, []);

    useEffect(() => {
        async function fetchAvailability() {
        
        
        const res = await axios.get(`${apiUrl}/bookings/availability`, { params: { courtId } });
        setSlots(res.data.availableSlots);
        }
        fetchAvailability();
    }, [courtId]);

    // const groupedSlots = slots.reduce((acc, slot) => {
    //     const slotDate = slot.date;
    //     if (!acc[slotDate]) {
    //         acc[slotDate] = [];
    //     }
    //     acc[slotDate].push(slot);
    //     return acc;
    // }, {});

    const handleBooking = async () => {
        if (!selectedSlot) return alert('Please select a time slot');  // Prompt the user if no time slot is selected
        if (!userId) return alert('User not logged in');
        // const { date, time, isAvailable } = selectedSlot;
        const { isAvailable } = selectedSlot;
        if (!isAvailable) {
            return alert('This time slot is already booked');
        }
        // const timeSlot = new Date(date); 
        try {
            
            const response = await axios.post(`${apiUrl}/bookings/book`, {
                userId,
                courtId,
                date: selectedSlot.date,
                timeSlot: `${selectedSlot.time}:00-${selectedSlot.time + 1}:00`,
            });

            setSlots((prevSlots) =>
                prevSlots.map((s) =>
                    s.date === selectedSlot.date && s.time === selectedSlot.time
                        ? { ...s, isAvailable: false }
                        : s
                )
            );
            navigate('/confirmation', { state: { booking: response.data.booking } });
        } catch (error) {
            alert('Booking failed');
        }
    };

    return (
        <div className="booking-page-container">
            <h2>Book a Slot</h2>
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

            {/* Display slots in a table */}
            <table className="slots-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        {/* Show time slots for each hour */}
                        {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((hour) => (
                            <th key={hour}>{`${hour}:00-${hour + 1}:00`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dates.map((day) => (
                        <tr key={day}>
                            <td style={{
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                        }}>{day}</td>
                            {/* Display time slots for each date */}
                            {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((hour) => {
                                const slot = slots.find(slot => slot.date === day && slot.time === hour);
                                    return (
                                        <td key={hour}>
                                        {slot ? (
                                            slot.isAvailable ? (
                                                <button
                                                    style={{
                                                        backgroundColor: selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'purple' : 'green',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {selectedSlot && selectedSlot.time === hour && selectedSlot.date === day ? 'Selected' : 'Available'}
                                                </button>
                                            ) : (
                                                <button
                                                    style={{
                                                        backgroundColor: 'gray',
                                                        color: 'white',
                                                        cursor: 'not-allowed',
                                                    }}
                                                    disabled
                                                >
                                                    Not Available
                                                </button>
                                            )
                                        ) : (
                                            'Loading...'
                                        )}
                                    </td>
                                    );
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                onClick={handleBooking}
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
            {/* loading */}
            {/* {isLoading && <p>Loading...</p>} */}
        </div>
    );
}


export default BookingPage;
