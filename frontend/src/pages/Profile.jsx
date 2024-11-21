import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    displayName: '',
    bio: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchUserData(), fetchBookingHistory()])
      .finally(() => setIsLoading(false));
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserData(data);
      setEditedData({
        displayName: data.displayName || data.username,
        bio: data.bio || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile error:', err);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await axios.get(`http://localhost:5001/api/bookings/history/${userId}`);
      
      if (response.data && Array.isArray(response.data)) {
        const now = moment();
        const upcoming = response.data.filter(booking => {
          const bookingDate = moment(booking.timeSlot);
          return bookingDate.isAfter(now) && booking.status !== 'cancelled';
        });
        
        setUpcomingBookings(upcoming.sort((a, b) => moment(a.timeSlot) - moment(b.timeSlot)));
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmed) return;

      await axios.delete(`http://localhost:5001/api/bookings/${bookingId}`);
      
      setUpcomingBookings(prevBookings => 
        prevBookings.filter(booking => booking._id !== bookingId)
      );
      
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!editedData.displayName.trim()) {
        setError('Display name cannot be empty');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: editedData.displayName.trim(),
          bio: editedData.bio.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setError('');
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const formatTimeSlot = (timeSlot) => {
    return moment(timeSlot).format('YYYY-MM-DD HH:mm');
  };

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-container">
              <div className="avatar-circle">
                {userData?.displayName?.charAt(0) || userData?.username?.charAt(0)}
              </div>
            </div>
            <div className="user-details">
              {!isEditing ? (
                <div className="user-info">
                  <div className="info-field">
                    <label>Username:</label>
                    <span>{userData?.username}</span>
                  </div>
                  <div className="info-field">
                    <label>Email:</label>
                    <span>{userData?.email}</span>
                  </div>
                  <div className="info-field">
                    <label>Display Name:</label>
                    <span>{userData?.displayName || userData?.username}</span>
                  </div>
                  <div className="info-field">
                    <label>Bio:</label>
                    <p className="user-bio">{userData?.bio || 'No bio yet.'}</p>
                  </div>
                  <span className="user-type">Casual Player</span>
                </div>
              ) : (
                <div className="edit-form">
                  <div className="info-field">
                    <label>Username:</label>
                    <span className="static-field">{userData?.username}</span>
                    <span className="field-hint">Username cannot be changed</span>
                  </div>
                  <div className="info-field">
                    <label>Email:</label>
                    <span className="static-field">{userData?.email}</span>
                    <span className="field-hint">Email cannot be changed</span>
                  </div>
                  <div className="info-field">
                    <label>Display Name:</label>
                    <input
                      type="text"
                      value={editedData.displayName}
                      onChange={(e) => setEditedData({...editedData, displayName: e.target.value})}
                      className="edit-input"
                      placeholder="Enter display name"
                      maxLength={30}
                    />
                  </div>
                  <div className="info-field">
                    <label>Bio:</label>
                    <textarea
                      value={editedData.bio}
                      onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                      className="edit-input bio-input"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      rows={3}
                    />
                    <span className="field-hint">{500 - (editedData.bio?.length || 0)} characters remaining</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="save-button" onClick={handleSave}>
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="bookings-section">
          <h2>Upcoming Reservations</h2>
          <div className="booking-list">
            {upcomingBookings.length === 0 ? (
              <div className="no-bookings">No upcoming reservations</div>
            ) : (
              upcomingBookings.map((booking) => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-date">
                    <div className="date-box">
                      {moment(booking.timeSlot).format('DD')}
                    </div>
                    <span>{moment(booking.timeSlot).format('MMM')}</span>
                  </div>
                  <div className="booking-details">
                    <h3>{booking.courtId.name}</h3>
                    <p>Time: {formatTimeSlot(booking.timeSlot)}</p>
                    <p>Location: {booking.courtId.address}</p>
                    <p>Status: <span className="status-tag">Confirmed</span></p>
                  </div>
                  <button 
                    className="cancel-reservation"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;