import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [hasFlightBookings, setHasFlightBookings] = useState(false);
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  // Logic: Fetch bookings from Django backend (Port 8000)
  useEffect(() => {
    if (token) {
      // Check if user has bookings in the Django Database
      fetch('https://travelgo-django.onrender.com/api/bookings/')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setHasFlightBookings(true);
          } else {
            setHasFlightBookings(false);
          }
        })
        .catch(err => console.error("Could not check bookings status:", err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setHasFlightBookings(false);
    navigate('/login');
    window.location.reload(); // Re-checks authentication in App.js
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
           <img src="/TravelGo_logo1.png" alt="TravelGo Logo" />
        </Link>

        {/* Navigation menu items only shown if logged in */}
        {token && (
          <ul className="nav-links">
            <li><Link to="/hotels" className="nav-link-item">Hotels</Link></li>
            <li><Link to="/flights" className="nav-link-item">Flights</Link></li>
          </ul>
        )}

        <div className="nav-actions">
          {token ? (
            <div className="logged-in-section">
              {/* FEATURE IMPLEMENTED: Hide button if no bookings */}
              {hasFlightBookings && (
                <Link to="/my-bookings" className="manage-trips-link">
                    My Bookings
                </Link>
              )}
              
              <span className="user-greet" style={{ color: 'white', marginLeft: '15px' }}>
                Hi, <b>{userEmail ? userEmail.split('@')[0] : 'Traveler'}</b>
              </span>

              {/* LOGOUT BUTTON ADDED */}
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