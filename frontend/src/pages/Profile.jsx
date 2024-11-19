import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editedData, setEditedData] = useState({
    displayName: '',
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
      console.log('Saving data:', editedData); // 调试日志

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
      console.log('Server response:', updatedData); // 调试日志
      
      setUserData(updatedData);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Update error:', err);
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

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <nav className="nav-bar">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            BadmintonBooker
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Account</Link>
        </div>
      </nav>

      <div className="profile-hero">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar-container">
              <div className="avatar-circle"></div>
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