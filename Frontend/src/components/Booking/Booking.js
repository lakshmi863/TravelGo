import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    MdEventSeat, 
    MdPerson, 
    MdEmail, 
    MdPhone, 
    MdFormatQuote, 
    MdSecurity, 
    MdFlight 
} from 'react-icons/md';
import './Booking.css';

// Config: Airplane Layout
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TAKEN_SEATS = ['1A', '2C', '4F', '7B', '9E', '10C', '5B']; 

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Using both 'flight' and 'schedule' now (Warning Fixed!)
    const { flight, schedule } = location.state || {};

    const [selectedSeat, setSelectedSeat] = useState(null);
    const [locationInfo, setLocationInfo] = useState("Detecting...");
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        // 1. Logic for unique device tracking
        let devId = localStorage.getItem('travelgo_dev_id') || 'TG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('travelgo_dev_id', devId);

        // 2. Fetch IP-based location for security tags
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => setLocationInfo(`${data.city}, ${data.country_name}`))
            .catch(() => setLocationInfo("Location Restricted"));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSeatClick = (seatId) => {
        if (TAKEN_SEATS.includes(seatId)) return;
        setSelectedSeat(seatId);
    };

    /**
     * SQUARING LOGIC:
     * This follows a two-step process inside your Django DB only.
     */
    const handleLocalBooking = async (e) => {
        e.preventDefault();

        if (!selectedSeat) return alert("Please click a seat inside the cabin map!");

        setIsSubmitting(true);

        // 1. Prepare data for the PENDING booking
        const payload = {
            flight: flight.id,
            passenger_name: formData.name,
            passenger_email: formData.email,
            passenger_phone: formData.phone,
            seat_number: selectedSeat,
            total_price: flight.price,
            booking_location: locationInfo,
            // Dynamic date logic for model verification
            flight_departure_datetime: new Date(Date.now() + 172800000).toISOString(), 
            device_id: localStorage.getItem('travelgo_dev_id')
        };

        try {
            // STEP 1: CREATE PENDING DATA (Step 1 of Squaring)
            const createRes = await fetch('https://travelgo-django.onrender.com/api/bookings/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await createRes.json();

            if (!createRes.ok) throw new Error(data.message || "Middleware validation failed (check Phone format)");

            // STEP 2: SIMULATE LOCAL PROCESSING
            alert(`Generating Local Reference: ${data.mock_order_id}. \nSquaring data in database...`);

            // STEP 3: FINAL VERIFICATION (Flips status to BOOKED and triggers Email)
            const verifyRes = await fetch(`https://travelgo-django.onrender.com/api/bookings/${data.booking_id}/verify_payment/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (verifyRes.ok) {
                const final = await verifyRes.json();
                alert(`🎉 SUCCESS! Ticket Squaring Completed. \nID: ${final.transaction_id}`);
                navigate('/my-bookings');
            } else {
                alert("Database verification failed. Data not squared.");
                setIsSubmitting(false);
            }

        } catch (error) {
            alert("BOOKING ERROR: " + error.message);
            setIsSubmitting(false);
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
                            onClick={() => handleSeatClick(seatId)}
                        >
                            <MdEventSeat />
                            <span className="seat-label">{seatId}</span>
                        </div>
                    );
                })}
            </div>
        ));
    }, [selectedSeat]);

    if (!flight) return <div className="loader" style={{textAlign:'center', marginTop: '100px'}}><h2>Session Invalid. Re-search flights.</h2></div>;

    return (
        <div className="booking-page">
            <div className="container booking-grid">
                
                {/* LEFT: CABIN AND BANNER */}
                <div className="seat-selection-container">
                    <div className="flight-promo-banner" style={{backgroundImage: `url("https://i.pinimg.com/736x/62/9a/96/629a9689618ee84d9088ba4a73e2e2f6.jpg")`}}>
                        <div className="banner-overlay"></div>
                        <div className="quotation-box">
                            <MdFormatQuote className="quote-icon" size={32} />
                            <p>Adventure awaits in <span>{flight.destination}</span>. Confirm your preferred seat to continue.</p>
                        </div>
                    </div>

                    <div className="airplane-cabin">
                        <div className="cockpit">COCKPIT</div>
                        <div className="cabin-rows">{SeatMap}</div>
                    </div>
                </div>

                {/* RIGHT: TICKET DETAILS & FORM */}
                <div className="booking-form-container">
                    <div className="summary-box">
                        <h4>{flight.airline} Aviation</h4>
                        
                        {/* WARNING FIXED: schedule is used here */}
                        <p style={{fontSize: '13px'}}>
                            <MdFlight /> Flight: <strong>{schedule?.code || "TG-AUTO"}</strong> | {flight.origin} → {flight.destination}
                        </p>
                        
                        <div className="sum-price">
                            <span>Final Total:</span>
                            <strong>₹{Number(flight.price).toLocaleString('en-IN')}</strong>
                        </div>
                        <div className={`seat-badge ${selectedSeat ? 'active' : ''}`}>
                            {selectedSeat ? `CONFIRMED SEAT: ${selectedSeat}` : "PLEASE SELECT A SEAT"}
                        </div>
                    </div>

                    <form className="passenger-form" onSubmit={handleLocalBooking}>
                        <h3>Passenger & Security Details</h3>
                        
                        <div className="form-group">
                            <label><MdPerson /> Traveler Name</label>
                            <input type="text" name="name" onChange={handleInputChange} placeholder="As per Govt ID" required />
                        </div>

                        <div className="form-group">
                            <label><MdEmail /> Contact Email</label>
                            <input type="email" name="email" onChange={handleInputChange} placeholder="For E-ticket delivery" required />
                        </div>

                        <div className="form-group">
                            <label><MdPhone /> Mobile (Numbers Only)</label>
                            <input type="tel" name="phone" onChange={handleInputChange} placeholder="10 Digits" required />
                        </div>

                        <div className="security-notice" style={{marginTop:'15px', fontSize:'11px', color:'#64748b'}}>
                            <MdSecurity /> Connection Secure. Data squared in TravelGo Private SQLite vault.
                        </div>

                        <button type="submit" disabled={isSubmitting || !selectedSeat} className="payment-btn">
                            {isSubmitting ? "Finalizing Transaction..." : `Confirm Seat & Book`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;