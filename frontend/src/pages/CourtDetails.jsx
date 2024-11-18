import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CourtDetails.css';

const CourtDetails = () => {
  const { id } = useParams(); // 获取 URL 参数
  const [court, setCourt] = useState(null);

  useEffect(() => {
    // 获取指定球场详情
    fetch(`http://localhost:5000/api/courts/${id}`)
      .then((res) => res.json())
      .then((data) => setCourt(data));
  }, [id]);

  useEffect(() => {
    if (court) {
      // 初始化 Google Maps
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

  if (!court) return <div>Loading...</div>;

  return (
    <div className="court-details-container">
      <h1>{court.name}</h1>
      <img src={court.image} alt={court.name} />
      <p>{court.address}</p>
      <div id="map" style={{ width: '100%', height: '400px', margin: '20px 0' }}></div>
      <button className="book-now">Book Now</button>
    </div>
  );
};

export default CourtDetails;