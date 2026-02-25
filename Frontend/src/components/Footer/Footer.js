import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MdEmail, MdPhone, MdLocationOn, 
  MdFlight, MdHotel, MdCardGiftcard 
} from 'react-icons/md';
import { 
  FaFacebookF, FaTwitter, FaInstagram, 
  FaLinkedinIn, FaYoutube 
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        
        {/* 1. BRAND SECTION */}
        <div className="footer-column brand-col">
          <Link to="/" className="footer-logo">
            <img src="/TravelGo_logo2.png" alt="TravelGo Logo" />
          </Link>
          <p className="footer-desc">
            TravelGo is a premier digital travel partner dedicated to making global exploration 
            seamless, affordable, and inspiring. Connecting skies and souls since 2024.
          </p>
          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* 2. SERVICES SECTION */}
        <div className="footer-column">
          <h3>Our Services</h3>
          <ul className="footer-links">
            <li><Link to="/flights"><MdFlight /> Flight Bookings</Link></li>
            <li><Link to="/hotels"><MdHotel /> Luxury Stays</Link></li>
            <li><Link to="/packages"><MdCardGiftcard /> Vacation Packages</Link></li>
            <li><Link to="/activities">Adventure & Experiences</Link></li>
            <li><Link to="/deals">Exclusive Holiday Deals</Link></li>
          </ul>
        </div>

        {/* 3. SUPPORT SECTION */}
        <div className="footer-column">
          <h3>Help & Support</h3>
          <ul className="footer-links">
            <li><Link to="/my-bookings">Manage Bookings</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* 4. CONTACT SECTION */}
        <div className="footer-column contact-col">
          <h3>Get in Touch</h3>
          <div className="contact-item">
            <MdPhone className="c-icon" />
            <span>+91 9000 123 456</span>
          </div>
          <div className="contact-item">
            <MdEmail className="c-icon" />
            <span>support@travelgo.com</span>
          </div>
          <div className="contact-item">
            <MdLocationOn className="c-icon" />
            <span>Skyline Tower, Hitech City,<br /> Hyderabad, India</span>
          </div>
          <div className="newsletter">
            <h4>Newsletter</h4>
            <div className="n-input-group">
              <input type="email" placeholder="Your Email" />
              <button>Join</button>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="footer-bottom">
        <div className="container bottom-flex">
          <p>&copy; 2026 TravelGo Aviation & Hospitality Group. All rights reserved.</p>
          <div className="payment-icons">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;