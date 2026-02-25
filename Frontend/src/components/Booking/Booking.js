import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    MdEventSeat, MdPerson, MdEmail, MdPhone, MdFormatQuote, 
    MdSecurity, MdFlight, MdCheckCircle, MdAutorenew, MdClose, MdHourglassTop
} from 'react-icons/md';
import './Booking.css';

const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TAKEN_SEATS = ['1A', '2C', '4F', '7B', '9E', '10C', '5B']; 

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flight, schedule } = location.state || {};

    const [selectedSeat, setSelectedSeat] = useState(null);
    const [locationInfo, setLocationInfo] = useState("Detecting...");
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    
    // UI MODAL CONFIG
    const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '', id: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        let devId = localStorage.getItem('travelgo_dev_id') || 'TG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('travelgo_dev_id', devId);
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => setLocationInfo(`${data.city}, ${data.country_name}`))
            .catch(() => setLocationInfo("Location Restricted"));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * UPDATED SQUARING LOGIC:
     * Now uses INSTANT BOOKING (Single Request) to avoid 400/CORS errors.
     */
    const handleLocalBooking = async (e) => {
        e.preventDefault();
        if (!selectedSeat) {
            setAlertConfig({ show: true, type: 'error', title: 'Seat Required', message: 'Please tap a seat in the cabin map first.' });
            return;
        }

        setIsSubmitting(true);
        
        // SHOW LOADING MODAL
        setAlertConfig({ 
            show: true, 
            type: 'process', 
            title: 'Securing Seat', 
            message: 'Validating inventory and generating your TravelGo digital square...' 
        });

        const payload = {
            flight: flight.id,
            passenger_name: formData.name,
            passenger_email: formData.email,
            passenger_phone: formData.phone,
            seat_number: selectedSeat,
            total_price: flight.price,
            booking_location: locationInfo,
            flight_departure_datetime: new Date(Date.now() + 172800000).toISOString(), 
            device_id: localStorage.getItem('travelgo_dev_id')
        };

        try {
            // STEP 1: Combined Create & Verify Call
            const response = await fetch('https://travelgo-django.onrender.com/api/bookings/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();

            if (response.ok) {
                // SUCCESS: Immediately update Modal to show verified transaction
                setAlertConfig({ 
                    show: true, 
                    type: 'success', 
                    title: 'Booking Squared!', 
                    message: `Success! Your ticket is confirmed. Digital boarding pass sent to ${formData.email}`, 
                    id: result.transaction_id 
                });
                
                // Navigate to My Bookings after success animation
                setTimeout(() => navigate('/my-bookings'), 2800);
            } else {
                throw new Error(result.error || result.message || "Squaring Rejected by Server.");
            }

        } catch (error) {
            setAlertConfig({ 
                show: true, 
                type: 'error', 
                title: 'Transaction Error', 
                message: error.message 
            });
            setIsSubmitting(false); // Enable button to try again
        }
    };

    const SeatMap = useMemo(() => {
        return ROWS.map(row => (
            <div key={row} className="seat-row">
                <span className="row-number">{row}</span>
                {COLS.map((col) => {
                    const seatId = `${row}${col}`;
                    const isTaken = TAKEN_SEATS.includes(seatId);
                    const isSelected = selectedSeat === seatId;
                    return (
                        <div
                            key={col}
                            className={`seat ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => !isTaken && setSelectedSeat(seatId)}
                        >
                            <MdEventSeat />
                            <span className="seat-label">{seatId}</span>
                        </div>
                    );
                })}
            </div>
        ));
    }, [selectedSeat]);

    if (!flight) return <div className="loader"><h2>Redirecting...</h2></div>;

    return (
        <div className="booking-page">
            <div className="container booking-grid">
                
                {/* DYNAMIC ALERT CARD & LOADING SCREEN */}
                {alertConfig.show && (
                    <div className="custom-overlay">
                        <div className={`status-card ${alertConfig.type}`}>
                            <div className="card-icon-header">
                                {alertConfig.type === 'process' && <MdAutorenew className="ani-spin" />}
                                {alertConfig.type === 'success' && <MdCheckCircle />}
                                {alertConfig.type === 'error' && <MdClose />}
                            </div>
                            <h3>{alertConfig.title}</h3>
                            <p>{alertConfig.message}</p>
                            
                            {alertConfig.id && <div className="ref-tag">TRX-REF: {alertConfig.id}</div>}
                            
                            {alertConfig.type === 'success' && (
                                <div className="auto-redirect-msg">Generating Boarding Pass...</div>
                            )}

                            {alertConfig.type === 'error' && (
                                <button className="modal-dismiss-btn" onClick={() => setAlertConfig({ ...alertConfig, show: false })}>
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="seat-selection-container">
                    <div className="flight-promo-banner" style={{backgroundImage: `url("https://i.pinimg.com/736x/62/9a/96/629a9689618ee84d9088ba4a73e2e2f6.jpg")`}}>
                        <div className="banner-overlay"></div>
                        <div className="quotation-box">
                            <MdFormatQuote className="quote-icon" size={32} />
                            <p>Adventure awaits in <span>{flight.destination}</span>. Confirm your preferred seat to continue.</p>
                        </div>
                    </div>
                    <div className="airplane-cabin"><div className="cockpit">COCKPIT</div><div className="cabin-rows">{SeatMap}</div></div>
                </div>

                <div className="booking-form-container">
                    <div className="summary-box">
                        <h4>{flight.airline} Aviation</h4>
                        <p style={{fontSize: '13px'}}><MdFlight /> Flight: <strong>{schedule?.code || "TG-772"}</strong> | {flight.origin} → {flight.destination}</p>
                        <div className="sum-price"><span>Final Total:</span><strong>₹{Number(flight.price).toLocaleString('en-IN')}</strong></div>
                        <div className={`seat-badge ${selectedSeat ? 'active' : ''}`}>{selectedSeat ? `CONFIRMED SEAT: ${selectedSeat}` : "PLEASE SELECT A SEAT"}</div>
                    </div>

                    <form className="passenger-form" onSubmit={handleLocalBooking}>
                        <h3>Passenger & Security Details</h3>
                        <div className="form-group"><label><MdPerson /> Traveler Name</label><input type="text" name="name" onChange={handleInputChange} placeholder="Full Name" required /></div>
                        <div className="form-group"><label><MdEmail /> Contact Email</label><input type="email" name="email" onChange={handleInputChange} placeholder="For E-ticket" required /></div>
                        <div className="form-group"><label><MdPhone /> Mobile</label><input type="tel" name="phone" onChange={handleInputChange} placeholder="Phone Number" required /></div>
                        
                        <button type="submit" disabled={isSubmitting || !selectedSeat} className="payment-btn">
                            {isSubmitting ? "FINALIZING TRANSACTION..." : `Confirm Seat & Book`}
                        </button>
                        
                        <div className="vault-note" style={{marginTop:'15px', fontSize:'11px', color:'#94a3b8', textAlign:'center'}}>
                            <MdSecurity /> Secured via TravelGo Instant Square.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;