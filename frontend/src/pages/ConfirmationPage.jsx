import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ConfirmationPage.css';

function ConfirmationPage({ booking }) {
    const location = useLocation();
    booking = booking || location.state?.booking;

    if (!booking) {
        return <div>You have not booked any court yet!</div>;
    }

    return (
        <div>
            <h2>Booking Confirmation</h2>
            <p>Thank you for your reservation!</p>
            <p>Your booking has been confirmed.</p>
            <ul>
                <li>Court Name: {booking.courtName}</li>
                <li>Date & Time: {booking.date} at {booking.timeSlot}</li>
                {/* <li>Total Cost: ${booking.cost}</li> */}
                <li>Location: {booking.courtLocation}</li>
                {/* <li>Contact: {booking.courtId.contact}</li> */}
            </ul>
            <button onClick={() => window.location.href = '/'}>Return to Home</button>
        </div>
    );
}

export default ConfirmationPage;
