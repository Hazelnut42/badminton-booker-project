import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CourtDetails.css';

const CourtDetails = () => {
  const { id } = useParams(); // Get the court ID from the URL
  const navigate = useNavigate(); // Get the navigate function from the router
  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourtDetails() {
      try {
        const res = await fetch(`http://localhost:5001/api/courts/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch court details');
        }
        const data = await res.json();
        setCourt(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load court details. Please try again later.');
      }
    }
    fetchCourtDetails();
  }, [id]);

  useEffect(() => {
    if (court && window.google) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: court.coordinates.lat, lng: court.coordinates.lng },
        zoom: 14,
      });
      new window.google.maps.Marker({
        position: { lat: court.coordinates.lat, lng: court.coordinates.lng },
        map: map,
      });
    }
  }, [court]);

  if (error) return <div className="error">{error}</div>;
  if (!court) return <div>Loading...</div>;

  return (
    <div className="court-details-container">
      <h1>{court.name}</h1>
      <img src={court.image} alt={court.name} />
      <p>{court.address}</p>
      <div id="map" style={{ width: '100%', height: '400px', margin: '20px 0' }}></div>
      <button className="book-now" onClick={() => navigate(`/bookings/${id}`)}>
        Book Now
      </button>
    </div>
  );
};

export default CourtDetails;