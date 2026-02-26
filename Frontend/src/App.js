import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components...
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import FlightResults from './components/FlightResults/FlightResults'; 
import Booking from './components/Booking/Booking';
import MyBookings from './components/MyBookings/MyBookings';
import Hotels from './components/Hotels/Hotels';
import Packages from './components/Packages/Packages';
import Activities from './components/Activities/Activities';
import Footer from './components/Footer/Footer';
import AIChat from './components/AI/AIChat';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // --- NEW: INSPECT ELEMENT PROTECTION LOGIC ---
  useEffect(() => {
    // 1. Disable Right-Click (Context Menu)
    const handleContextMenu = (e) => e.preventDefault();

    // 2. Disable Key Shortcuts (F12, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12 Key
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I (Inspect) or J (Console)
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (View Source)
      ) {
        e.preventDefault();
        console.warn("TravelGo Security: Developer Tools are restricted.");
      }
    };

    // Attach listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- EXISTING: STORAGE CHANGE LOGIC ---
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Hero />} />
            <Route path="/flights" element={<FlightResults />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      <AIChat />
      <Footer />
    </Router>
  );
};

export default App;