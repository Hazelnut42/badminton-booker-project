import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    displayName: '',
    email: '',
    bio: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
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
        email: data.email,
        bio: data.bio || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) return (
    <div className="profile-page">
      <div className="loading">Loading...</div>
    </div>
  );

  return (
    <div className="profile-page">
      <nav className="nav-bar">
        <div className="logo">BadmintonBooker</div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/account" className="nav-link">Account</a>
        </div>
      </nav>

      <div className="profile-hero">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-container">
              <div className="avatar-circle"></div>
            </div>
            {!isEditing ? (
              <div className="user-info">
                <h1>{userData?.displayName || userData?.username}</h1>
                <span className="user-type">Casual Player</span>
                <p className="user-bio">{userData?.bio || 'Manage your booking history and preferences here.'}</p>
              </div>
            ) : (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedData.displayName}
                  onChange={(e) => setEditedData({...editedData, displayName: e.target.value})}
                  className="edit-input"
                  placeholder="Display Name"
                />
                <textarea
                  value={editedData.bio}
                  onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  className="edit-input bio-input"
                  placeholder="Add a bio"
                />
              </div>
            )}
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
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2>Booking History</h2>
        <div className="booking-list">
          <div className="booking-item">
            <div className="booking-date">
              <div className="date-box">17</div>
              <span>OCT</span>
            </div>
            <div className="booking-details">
              <h3>Court 1 - Vancouver Sports Center</h3>
              <p>Date: 10/20/2022</p>
            </div>
            <div className="booking-status">Paid</div>
          </div>
          <div className="booking-item">
            <div className="booking-date">
              <div className="date-box">15</div>
              <span>SEP</span>
            </div>
            <div className="booking-details">
              <h3>Court 3 - Badminton Arena</h3>
              <p>Date: 09/15/2022</p>
            </div>
            <div className="booking-status">Paid</div>
          </div>
        </div>

        <h2>Upcoming Reservations</h2>
        <div className="booking-list">
          <div className="booking-item">
            <div className="booking-details">
              <h3>Court 2 - Sports Hub Center</h3>
              <p>Date: 11/05/2022, Status: Confirmed</p>
            </div>
            <button className="cancel-reservation">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;