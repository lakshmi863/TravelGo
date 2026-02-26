import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsMobileMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const username = userEmail ? userEmail.split('@')[0] : 'Traveler';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/TravelGo_logo2.png" alt="TravelGo Logo" />
        </Link>

        {/* DESKTOP LINKS - Stays in the middle */}
        {token && (
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            {/* Show only inside Sidebar on Mobile */}
            <div className="mobile-menu-header desktop-only" style={{display:'none'}}>
               <p>Welcome, <b>{username}</b></p>
            </div>
            
            <li><Link to="/hotels" onClick={() => setIsMobileMenuOpen(false)}>Hotels</Link></li>
            <li><Link to="/flights" onClick={() => setIsMobileMenuOpen(false)}>Flights</Link></li>
            <li><Link to="/activities" onClick={() => setIsMobileMenuOpen(false)}>Activities</Link></li>
            <li><Link to="/my-bookings" onClick={() => setIsMobileMenuOpen(false)}>My Bookings</Link></li>
            
            {/* Log out only inside Sidebar */}
            <li className="mobile-only-item">
               <button onClick={handleLogout} className="mobile-logout-btn" style={{display: isMobileMenuOpen ? 'block' : 'none'}}>
                 LOGOUT
               </button>
            </li>
          </ul>
        )}

        {/* RIGHT SIDE ACTIONS */}
        <div className="nav-actions">
          {token ? (
            <>
              <span className="user-greet desktop-only">
                Hi, <b>{username}</b>
              </span>
              <button onClick={handleLogout} className="logout-nav-btn desktop-only">
                Logout
              </button>
              {/* Hamburger (Only visible on mobile) */}
              <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
              </div>
            </>
          ) : (
            <div className="auth-links">
               <Link to="/login" className="login-link" style={{color:'white', textDecoration:'none', fontWeight:'700'}}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;