import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.css';

const Homepage = () => {
    const [courts, setCourts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true); // 添加加载状态
    const [error, setError] = useState(null); // 添加错误状态

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/courts');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setCourts(data);
            } catch (error) {
                console.error("Error fetching courts:", error);
                setError("Failed to load courts data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourts();
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
            {loading ? (
                <p>Loading courts...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="courts-list">
                    {filteredCourts.map(court => (
                        <div key={court._id} className="court-item">
                            <img src={court.image} alt={court.name} />
                            <h2>{court.name}</h2>
                            <p>{court.address}</p>
                            <Link to={`/court/${court._id}`}>View Details</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Homepage;