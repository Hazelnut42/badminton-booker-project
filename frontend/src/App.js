import './styles/Global.css';
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import CourtDetails from './pages/CourtDetails';
import Profile from './pages/Profile';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        {/* Homepage */}
        <Route path="/home" element={<Homepage />} />

        {/* Court details page */}
        <Route path="/court/:id" element={<CourtDetails />} />

        {/* Login page */}
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Booking page */}
        <Route path="/bookings/:courtId" element={
          <PrivateRoute>
            <BookingPage user={user} />
          </PrivateRoute>
        }
        />

        {/* Confirmation page */}
        <Route path="/confirmation" element={<ConfirmationPage />} />

        {/* Protected profile page */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile user={user} />
            </PrivateRoute>
          }
        />

        {/* Redirect root route */}
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default App;