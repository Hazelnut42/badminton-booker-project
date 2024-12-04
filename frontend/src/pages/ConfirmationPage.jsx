// Import necessary libraries and styles
import React from 'react'; // React library for component creation
import { useLocation } from 'react-router-dom'; // Hook to access location object for state
import '../styles/ConfirmationPage.css';

// Define the ConfirmationPage component
function ConfirmationPage({ booking }) {
    const location = useLocation(); // Get the current location to retrieve passed state
    booking = booking || location.state?.booking; // Use passed booking prop or fallback to state

    // Handle case when no booking details are provided
    if (!booking) {
        return <div>You have not booked any court yet!</div>;
    }

    // Render the booking confirmation details
    return (
        <div>
            {/* Page heading */}
            <h2>Booking Confirmation</h2>
            {/* Confirmation messages */}
            <p>Thank you for your reservation!</p>
            <p>Your booking has been confirmed.</p>
            {/* Display booking details */}
            <ul>
                <li>Court Name: {booking.courtName}</li>
                <li>Date & Time: {booking.date} at {booking.timeSlot}</li>
                <li>Location: {booking.courtLocation}</li>
            </ul>
            {/* Button to return to the homepage */}
            <button onClick={() => window.location.href = '/'}>Return to Home</button>
        </div>
    );
}

// Export the component to use it in other parts of the application
export default ConfirmationPage;
