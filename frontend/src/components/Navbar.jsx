import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      <button onClick={handleAccountClick}>Account</button>
    </nav>
  );
};

export default Navbar;