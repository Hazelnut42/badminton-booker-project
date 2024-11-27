import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CourtDetails.css';
import config from '../config';

const apiUrl = config.apiUrl;

window.initMap = () => {
  console.log('Google Maps API loaded');
};

const CourtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    console.log('Current court data:', court);
    console.log('Maps loaded status:', mapsLoaded);
    console.log('Google object:', window.google);
  }, [court, mapsLoaded]);

  useEffect(() => {
    console.log('API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY); 
    if (window.google) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2FAXYa0XZ-xSz29Almhfj6OizW64x_RA&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Script loaded successfully');
      setMapsLoaded(true);
    };

    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
      setError('Failed to load map. Please try again later.');
    };

    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector(`script[src="${script.src}"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchCourtDetails() {
      try {
        const res = await fetch(`${apiUrl}/courts/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch court details');
        }
        const data = await res.json();
        console.log('Fetched court data:', data);
        if (!data.coordinates) {
          throw new Error('Court coordinates not found');
        }
        setCourt(data);
      } catch (err) {
        console.error('Error fetching court details:', err);
        setError('Unable to load court details. Please try again later.');
      }
    }
    fetchCourtDetails();
  }, [id]);

  useEffect(() => {
    if (court && mapsLoaded && window.google) {
      console.log('Initializing map with coordinates:', court.coordinates);
      try {
        const map = new window.google.maps.Map(document.getElementById('map'), {
          center: { lat: court.coordinates.lat, lng: court.coordinates.lng },
          zoom: 14,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true
        });

        new window.google.maps.Marker({
          position: { lat: court.coordinates.lat, lng: court.coordinates.lng },
          map: map,
          title: court.name
        });
        
        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error loading map component');
      }
    }
  }, [court, mapsLoaded]);

  if (error) return <div className="error">{error}</div>;
  if (!court) return <div>Loading...</div>;

  return (
    <div className="court-details-container">
      <h1>{court.name}</h1>
      <img src={court.image} alt={court.name} />
      <p>{court.address}</p>
      <div 
        id="map" 
        style={{ 
          width: '100%', 
          height: '400px', 
          margin: '20px 0',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      ></div>
      <button className="book-now" onClick={() => navigate(`/bookings/${id}`)}>
        Book Now
      </button>
    </div>
  );
};

export default CourtDetails;