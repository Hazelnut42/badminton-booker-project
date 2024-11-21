import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CourtDetails.css';

const CourtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      setMapLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts during loading
      document.head.removeChild(script);
    };
  }, []);

  // Fetch court details
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

  // Initialize map when both court data and Google Maps are loaded
  useEffect(() => {
    if (court && mapLoaded && window.google) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: court.coordinates.lat, lng: court.coordinates.lng },
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: true,
        streetViewControl: true,
        zoomControl: true,
      });

      const marker = new window.google.maps.Marker({
        position: { lat: court.coordinates.lat, lng: court.coordinates.lng },
        map: map,
        title: court.name,
      });

      // Optional: Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <h3>${court.name}</h3>
            <p>${court.address}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    }
  }, [court, mapLoaded]);

  if (error) return <div className="error">{error}</div>;
  if (!court) return <div>Loading...</div>;

  return (
    <div className="court-details-container">
      <h1>{court.name}</h1>
      <img src={court.image} alt={court.name} />
      <p>{court.address}</p>
      <div id="map" style={{ 
        width: '100%', 
        height: '400px', 
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}></div>
      <button 
        className="book-now" 
        onClick={() => navigate(`/bookings/${id}`)}
      >
        Book Now
      </button>
    </div>
  );
};

export default CourtDetails;