import React from 'react';
import '../styles/ConfirmationPage.css';

function ConfirmationPage({ booking }) {
    return (
        <div>
            <h2>Booking Confirmation</h2>
            <p>Thank you for your reservation!</p>
            <p>Your booking has been confirmed.</p>
            <ul>
                <li>Court Name: {booking.courtId.name}</li>
                <li>Date & Time: {booking.date} at {booking.timeSlot}</li>
                <li>Total Cost: ${booking.cost}</li>
                <li>Location: {booking.courtId.location}</li>
                <li>Contact: {booking.courtId.contact}</li>
            </ul>
            <button onClick={() => window.location.href = '/'}>Return to Home</button>
        </div>
    );
}

export default ConfirmationPage;
