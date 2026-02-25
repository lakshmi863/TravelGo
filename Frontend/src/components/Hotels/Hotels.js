import React, { useState, useMemo } from 'react';
import { 
    MdStar, MdLocationOn, MdWifi, MdPool, 
    MdFitnessCenter, MdRestaurant, MdFilterList, MdSearch, 
    MdArrowBack, MdMap, MdInfo, MdCheckCircle, MdPayment, 
    MdPerson, MdCancel, MdEmail 
} from 'react-icons/md';
import './Hotels.css';

// Constant City List for data generation
const CITIES_LIST = ["Hyderabad", "Mumbai", "Delhi", "Bangalore", "Pune", "Vizag", "Chennai", "Dubai"];

const Hotels = () => {
    // UI Navigation State: 'list', 'details', 'payment', 'success'
    const [viewStep, setViewStep] = useState('list');
    const [viewingHotel, setViewingHotel] = useState(null);
    const [lastBookingId, setLastBookingId] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(50000);

    // Form State (Captured for MongoDB and Email)
    const [paymentData, setPaymentData] = useState({ 
        name: '', 
        email: '', 
        cardNumber: '', 
        expiry: '' 
    });

    // Generate flat list of Hotels for all cities
    const allHotels = useMemo(() => {
        let flatList = [];
        CITIES_LIST.forEach(city => {
            const cityHotels = Array.from({ length: 10 }).map((_, i) => ({
                id: `${city}-${i}`,
                name: `${city} ${["Grand", "Palace", "Residency", "Heritage", "Majestic"][i % 5]} ${i + 1}`,
                location: `${["Central Hub", "Airport Road", "Skyline Avenue", "Tourist Square", "Tech Park"][i % 5]}`,
                city: city,
                price: Math.floor(Math.random() * 35000) + 2500,
                rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
                stars: i % 2 === 0 ? 5 : 4,
                type: i % 3 === 0 ? "Luxury Resort" : "Business Hotel",
                description: "Experience absolute luxury in the heart of the city. This premium property features award-winning restaurants, a temperature-controlled rooftop pool, and personalized concierge services to make your stay unforgettable.",
                fullAddress: `${100 + i}, Premier Square, Opposite City Mall, ${city}, Pin: 500${i}10`,
                image: `https://images.unsplash.com/photo-${[
                    "1566073771259-6a8506099945", "1542314831-068cd1dbfeeb", 
                    "1571896349842-33c89424de2d", "1445019980597-93fa8acb246c"
                ][i % 4]}?auto=format&fit=crop&w=800&q=80`,
            }));
            flatList = [...flatList, ...cityHotels];
        });
        return flatList;
    }, []);

    // Filter Logic based on Sidebar Search and Price Slider
    const filteredHotels = allHotels.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = hotel.price <= priceRange;
        return matchesSearch && matchesPrice;
    });

    // POST Booking to Node/Express Backend (MongoDB + Email)
    const handleConfirmBooking = async (e) => {
        e.preventDefault();

        const payload = {
            hotelName: viewingHotel.name,
            city: viewingHotel.city,
            passengerName: paymentData.name,
            passengerEmail: paymentData.email,
            totalPrice: viewingHotel.price,
            address: viewingHotel.fullAddress,
            checkIn: new Date().toISOString(),
            checkOut: new Date(Date.now() + 172800000).toISOString() // 48 Hours Later
        };

        try {
            const response = await fetch('http://localhost:5000/api/hotels/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                setLastBookingId(result.booking._id);
                setViewStep('success');
            } else {
                alert("Booking Failed: " + result.message);
            }
        } catch (error) {
            console.error("MongoDB/API Error:", error);
            alert("Database Error. Ensure your Node Server is running on port 5000.");
        }
    };

    // ======================================================================
    // VIEW 1: MAIN HOTEL LIST (SIDEBAR FILTERED)
    // ======================================================================
    if (viewStep === 'list') return (
        <div className="hotels-page">
            <div className="container hotels-layout">
                {/* Unified Sidebar Filter */}
                <aside className="hotels-filter-sidebar">
                    <div className="filter-header">
                        <MdFilterList /> <h3>Refine Search</h3>
                    </div>

                    <div className="filter-group">
                        <label>Search Destinations</label>
                        <div className="sidebar-search-box">
                            <MdSearch className="side-s-icon" />
                            <input 
                                type="text" 
                                placeholder="Enter City or Hotel..." 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Max Budget: ₹{Number(priceRange).toLocaleString()}</label>
                        <input 
                            type="range" min="2000" max="50000" 
                            value={priceRange} 
                            onChange={(e) => setPriceRange(e.target.value)} 
                            className="h-price-slider"
                        />
                    </div>

                    <div className="filter-group">
                        <label>Star Category</label>
                        <div className="check-item"><input type="checkbox" /> 5 Star Premium</div>
                        <div className="check-item"><input type="checkbox" /> 4 Star Deluxe</div>
                    </div>

                    <div className="filter-group">
                        <label>Property Type</label>
                        <div className="check-item"><input type="checkbox" /> Resorts</div>
                        <div className="check-item"><input type="checkbox" /> Hotels</div>
                    </div>

                    <div className="filter-group">
                        <label>Popular Services</label>
                        <div className="check-item"><MdPool /> Swimming Pool</div>
                        <div className="check-item"><MdWifi /> High Speed Wifi</div>
                    </div>
                </aside>

                <main className="hotels-display">
                    <div className="display-header">
                        <h2>{searchTerm ? `Properties in "${searchTerm}"` : 'Premium Stays Worldwide'}</h2>
                        <p>Showing {filteredHotels.length} verified results</p>
                    </div>

                    <div className="hotel-grid">
                        {filteredHotels.map(hotel => (
                            <div key={hotel.id} className="hotel-card">
                                <img src={hotel.image} alt={hotel.name} />
                                <div className="hotel-info">
                                    <div className="hotel-title-row">
                                        <h3>{hotel.name}</h3>
                                        <span className="h-rating">{hotel.rating}★</span>
                                    </div>
                                    <p className="h-loc"><MdLocationOn /> {hotel.location}, {hotel.city}</p>
                                    <div className="h-price-row">
                                        <div className="h-price">
                                            <small>Per Night</small>
                                            <strong>₹{hotel.price.toLocaleString()}</strong>
                                        </div>
                                        <button className="h-book-btn" onClick={() => { setViewingHotel(hotel); setViewStep('details'); }}>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );

    // ======================================================================
    // VIEW 2: HOTEL INFORMATION & MAP
    // ======================================================================
    if (viewStep === 'details') return (
        <div className="hotel-detail-page container">
            <button className="back-btn" onClick={() => setViewStep('list')}><MdArrowBack /> Back to Filters</button>
            <div className="detail-grid">
                <div className="detail-main">
                    <img src={viewingHotel.image} alt={viewingHotel.name} className="detail-img" />
                    <h1>{viewingHotel.name}</h1>
                    <p className="detail-full-address"><MdLocationOn /> {viewingHotel.fullAddress}</p>
                    <div className="detail-info-card">
                        <h3><MdInfo /> About the Property</h3>
                        <p>{viewingHotel.description}</p>
                    </div>
                    <div className="detail-map-card">
                        <h3><MdMap /> Area Map</h3>
                        <iframe title="map" width="100%" height="300" src={`https://www.google.com/maps?q=${viewingHotel.name}+${viewingHotel.city}&output=embed`} />
                    </div>
                </div>
                <div className="detail-sidebar">
                    <div className="booking-widget">
                        <h2>₹{viewingHotel.price} <small>/ night</small></h2>
                        <ul className="widget-perks">
                            <li><MdCheckCircle /> Professional Laundry</li>
                            <li><MdRestaurant /> Buffet Breakfast Incl.</li>
                            <li><MdFitnessCenter /> Access to Health Club</li>
                        </ul>
                        <button className="confirm-btn" onClick={() => setViewStep('payment')}>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // ======================================================================
    // VIEW 3: PAYMENT & NOTIFICATION EMAIL CAPTURE
    // ======================================================================
    if (viewStep === 'payment') return (
        <div className="payment-page container">
            <div className="payment-card">
                <div className="payment-header">
                    <h2>Secure Booking Checkout</h2>
                    <p>{viewingHotel.name} | {viewingHotel.city}</p>
                </div>

                <form className="payment-form" onSubmit={handleConfirmBooking}>
                    <div className="form-item">
                        <label><MdPerson /> Traveler's Full Name</label>
                        <input 
                            type="text" required placeholder="John Doe" 
                            onChange={(e) => setPaymentData({...paymentData, name: e.target.value})} 
                        />
                    </div>
                    <div className="form-item">
                        <label><MdEmail /> Email for Notifications</label>
                        <input 
                            type="email" required placeholder="name@domain.com" 
                            onChange={(e) => setPaymentData({...paymentData, email: e.target.value})} 
                        />
                        <small>* Your ticket and confirmation will be sent here.</small>
                    </div>
                    <div className="form-item">
                        <label><MdPayment /> Credit/Debit Card</label>
                        <input type="text" required placeholder="XXXX XXXX XXXX 4444" />
                        <div className="form-row">
                            <input type="text" placeholder="MM/YY" required />
                            <input type="password" placeholder="CVV" required />
                        </div>
                    </div>
                    <div className="cancellation-policy-box">
                        <p><strong>Refund Policy:</strong> This booking qualifies for a 100% full refund if cancelled up to 24 hours prior to check-in.</p>
                    </div>
                    <button type="submit" className="confirm-btn">Confirm Payment - ₹{viewingHotel.price}</button>
                    <button type="button" className="cancel-text-btn" onClick={() => setViewStep('details')}>Back to Details</button>
                </form>
            </div>
        </div>
    );

    // ======================================================================
    // VIEW 4: SUCCESS & CANCELLATION TRIGGER
    // ======================================================================
    if (viewStep === 'success') return (
        <div className="success-page container">
            <div className="success-card">
                <MdCheckCircle className="success-icon" size={80} />
                <h2>Booking Successful!</h2>
                <p>Confirmation email sent to <strong>{paymentData.email}</strong></p>
                <div className="success-receipt-info">
                    <p>Reference ID: #{lastBookingId}</p>
                    <p>Passenger: {paymentData.name}</p>
                </div>
                <div className="success-actions">
                    <button className="confirm-btn" onClick={() => setViewStep('list')}>Explore More Stays</button>
                    <button className="cancel-red-btn" onClick={() => {alert("Cancellation Request Stored. Your refund is being processed."); setViewStep('list');}}>
                       <MdCancel /> Request Cancellation & Refund
                    </button>
                </div>
            </div>
        </div>
    );

    return null;
};

export default Hotels;