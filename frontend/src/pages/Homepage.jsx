import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
    const [courts, setCourts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch('http://localhost:5000/api/courts')
            .then(res => res.json())
            .then(data => setCourts(data));
    }, []);

    const filteredCourts = courts.filter(court =>
        court.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="homepage-container">
            <header className="header">
                <h1>Badminton Booker</h1>
                <input
                    type="text"
                    placeholder="Search courts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </header>
            <div className="courts-list">
                {filteredCourts.map(court => (
                    <div key={court.id} className="court-item">
                        <img src={court.image} alt={court.name} />
                        <h2>{court.name}</h2>
                        <p>{court.address}</p>
                        <Link to={`/court/${court.id}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Homepage;