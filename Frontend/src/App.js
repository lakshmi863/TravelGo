import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import components as before...
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
  // Logic: Check if token exists in storage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Update authentication state when component mounts or storage changes
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
        {/* PUBLIC ROUTES - Only Login and Register */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {/* PROTECTED ROUTES - Only accessible if logged in */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Hero />} />
            <Route path="/flights" element={<FlightResults />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/activities" element={<Activities />} />
            {/* Catch-all: Redirect to home if logged in and route not found */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* MANDATORY LOGIN: If not logged in, any path redirects to /login */
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      <AIChat />
      <Footer />
    </Router>
  );
};

export default App;