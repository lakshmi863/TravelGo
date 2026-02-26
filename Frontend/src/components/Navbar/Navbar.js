import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md'; // Import Menu Icons
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [hasFlightBookings, setHasFlightBookings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for menu
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (token) {
      fetch('https://travelgo-django.onrender.com/api/bookings/')
        .then(res => res.json())
        .then(data => {
          setHasFlightBookings(Array.isArray(data) && data.length > 0);
        })
        .catch(err => console.error("Could not check bookings status:", err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setHasFlightBookings(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

 return (
  <nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
        <img src="/TravelGo_logo2.png" alt="TravelGo Logo" />
      </Link>

      <div className="nav-right-side">
        {/* User Greet for Tablet/Desktop */}
        {token && userEmail && (
          <span className="user-greet desktop-only">
            Hi, <b>{userEmail.split('@')[0]}</b>
          </span>
        )}

        {token && (
          <button onClick={handleLogout} className="logout-nav-btn desktop-only">
            Logout
          </button>
        )}

        {/* Hamburger Toggle - Always on Right for mobile */}
        {token && (
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
          </div>
        )}
      </div>

      {/* --- SIDEBAR MENU --- */}
      {token && (
        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
          <div className="mobile-menu-header">
             <img src="/TravelGo_logo2.png" alt="Logo" style={{height:'40px'}} />
             <p>Welcome, {userEmail?.split('@')[0]}</p>
          </div>
          <li><Link to="/hotels" onClick={() => setIsMobileMenuOpen(false)}>Hotels</Link></li>
          <li><Link to="/flights" onClick={() => setIsMobileMenuOpen(false)}>Flights</Link></li>
          <li><Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>My Bookings</Link></li>
          <li><Link to="/activities" onClick={() => setIsMobileMenuOpen(false)}>Activities</Link></li>
          <li className="mobile-only">
             <button onClick={handleLogout} className="mobile-logout-btn">LOGOUT</button>
          </li>
        </ul>
      )}
    </div>
  </nav>
);
};

export default Navbar;