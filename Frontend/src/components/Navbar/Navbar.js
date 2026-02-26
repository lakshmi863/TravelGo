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

        {/* --- HAMBURGER ICON FOR MOBILE --- */}
        {token && (
          <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <MdClose size={30} /> : <MdMenu size={30} />}
          </div>
        )}

        {/* --- NAVIGATION LINKS (Mobile and Desktop) --- */}
        {token && (
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
    <li>
      <Link to="/hotels" className="nav-link-item" onClick={() => setIsMobileMenuOpen(false)}>
        Hotels
      </Link>
    </li>
    <li>
      <Link to="/flights" className="nav-link-item" onClick={() => setIsMobileMenuOpen(false)}>
        Flights
      </Link>
    </li>
    <li className="mobile-only">
      <Link to="/my-bookings" className="nav-link-item" onClick={() => setIsMobileMenuOpen(false)}>
        My Bookings
      </Link>
    </li>
</ul>
        )}

        <div className="nav-actions">
          {token ? (
            <div className="logged-in-section">
              {hasFlightBookings && (
                <Link to="/my-bookings" className="manage-trips-link desktop-only">
                    My Bookings
                </Link>
              )}
              
              <span className="user-greet desktop-only" style={{ color: 'white', marginLeft: '15px' }}>
                Hi, <b>{userEmail ? userEmail.split('@')[0] : 'Traveler'}</b>
              </span>

              <button onClick={handleLogout} className="logout-nav-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/register" className="register-nav-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;