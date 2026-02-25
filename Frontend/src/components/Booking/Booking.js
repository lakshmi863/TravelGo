import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    MdEventSeat, MdPerson, MdEmail, MdPhone, MdFormatQuote, 
    MdSecurity, MdFlight, MdCheckCircle, MdAutorenew, MdClose
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
    
    // NEW: Alert States
    const [alertConfig, setAlertConfig] = useState({ show: false, type: '', title: '', message: '', id: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        let devId = localStorage.getItem('travelgo_dev_id') || 'TG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('travelgo_dev_id', devId);
        fetch('https://ipapi.co/json/').then(res => res.json()).then(data => setLocationInfo(`${data.city}, ${data.country_name}`)).catch(() => setLocationInfo("Location Restricted"));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocalBooking = async (e) => {
        e.preventDefault();
        if (!selectedSeat) {
            setAlertConfig({ show: true, type: 'error', title: 'Seat Required', message: 'Please select a seat from the cabin map.' });
            return;
        }

        setIsSubmitting(true);
        // Show Generating Card
        setAlertConfig({ show: true, type: 'process', title: 'Creating Intent', message: 'Generating unique Local Reference...' });

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
            const createRes = await fetch('https://travelgo-django.onrender.com/api/bookings/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await createRes.json();
            if (!createRes.ok) throw new Error(data.message || "Network Squaring Issue");

            // Update card to show Verifying
            setAlertConfig({ 
                show: true, 
                type: 'verify', 
                title: 'Data Generated', 
                message: `Order ID: ${data.mock_order_id}. Finalizing vault square...`, 
                id: data.mock_order_id 
            });

            // Verification Call
            const verifyRes = await fetch(`https://travelgo-django.onrender.com/api/bookings/${data.booking_id}/verify_payment/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (verifyRes.ok) {
                const final = await verifyRes.json();
                setAlertConfig({ 
                    show: true, 
                    type: 'success', 
                    title: 'Ticket Squared!', 
                    message: `ID: ${final.transaction_id}. Your digital boarding pass is ready.`, 
                    id: final.transaction_id 
                });
                
                setTimeout(() => navigate('/my-bookings'), 2500);
            } else {
                throw new Error("Verification Fail");
            }
        } catch (error) {
            setAlertConfig({ show: true, type: 'error', title: 'Process Failed', message: error.message });
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
                        <div key={col} className={`seat ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`} onClick={() => !isTaken && setSelectedSeat(seatId)}>
                            <MdEventSeat /><span className="seat-label">{seatId}</span>
                        </div>
                    );
                })}
            </div>
        ));
    }, [selectedSeat]);

    if (!flight) return <div className="loader"><h2>Session Invalid. Re-search flights.</h2></div>;

    return (
        <div className="booking-page">
            <div className="container booking-grid">
                {/* MODAL CARD COMPONENT */}
                {alertConfig.show && (
                    <div className="custom-overlay">
                        <div className={`status-card ${alertConfig.type}`}>
                            <div className="card-icon-header">
                                {alertConfig.type === 'process' && <MdAutorenew className="ani-spin" />}
                                {alertConfig.type === 'verify' && <MdSecurity className="ani-pulse" />}
                                {alertConfig.type === 'success' && <MdCheckCircle />}
                                {alertConfig.type === 'error' && <MdClose />}
                            </div>
                            <h3>{alertConfig.title}</h3>
                            <p>{alertConfig.message}</p>
                            {alertConfig.id && <div className="ref-tag">Ref: {alertConfig.id}</div>}
                            
                            {(alertConfig.type === 'error' || (alertConfig.type === 'success' && !isSubmitting)) && (
                                <button onClick={() => setAlertConfig({ ...alertConfig, show: false })}>Dismiss</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="seat-selection-container">
                    <div className="flight-promo-banner" style={{backgroundImage: `url("https://i.pinimg.com/736x/62/9a/96/629a9689618ee84d9088ba4a73e2e2f6.jpg")`}}>
                        <div className="banner-overlay"></div>
                        <div className="quotation-box">
                            <MdFormatQuote className="quote-icon" size={32} /><p>Adventure awaits in <span>{flight.destination}</span>. Confirm your preferred seat to continue.</p>
                        </div>
                    </div>
                    <div className="airplane-cabin"><div className="cockpit">COCKPIT</div><div className="cabin-rows">{SeatMap}</div></div>
                </div>

                <div className="booking-form-container">
                    <div className="summary-box">
                        <h4>{flight.airline} Aviation</h4>
                        <p style={{fontSize: '13px'}}><MdFlight /> Flight: <strong>{schedule?.code || "TG-AUTO"}</strong> | {flight.origin} → {flight.destination}</p>
                        <div className="sum-price"><span>Final Total:</span><strong>₹{Number(flight.price).toLocaleString('en-IN')}</strong></div>
                        <div className={`seat-badge ${selectedSeat ? 'active' : ''}`}>{selectedSeat ? `CONFIRMED SEAT: ${selectedSeat}` : "PLEASE SELECT A SEAT"}</div>
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
                            <label><MdPhone /> Mobile</label>
                            <input type="tel" name="phone" onChange={handleInputChange} placeholder="10 Digits" required />
                        </div>
                        <button type="submit" disabled={isSubmitting || !selectedSeat} className="payment-btn">
                            {isSubmitting ? "FINALIZING TRANSACTION..." : `Confirm Seat & Book`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Booking;