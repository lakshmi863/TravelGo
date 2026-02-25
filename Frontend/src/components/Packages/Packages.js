import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCardGiftcard, MdFlight, MdHotel, MdStar, MdCheckCircle } from 'react-icons/md';
import './Packages.css';

const MOCK_PACKAGES = [
    { id: 1, category: 'HONEYMOON', title: 'Maldives Overwater Luxury', price: 125000, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', flight: 'Emirates', hotel: 'Anantara Veli' },
    { id: 2, category: 'HOLIDAY', title: 'Bali Spirit & Sands', price: 65000, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', flight: 'AirAsia', hotel: 'Ayana Resort' },
    { id: 3, category: 'WEEKEND', title: 'Goa Beach Party Express', price: 18000, img: 'https://images.unsplash.com/photo-1512783562943-7a63ceec41ba?w=800', flight: 'IndiGo', hotel: 'Novotel Goa' },
    { id: 4, category: 'FAMILY', title: 'Disneyland Paris Magic', price: 155000, img: 'https://images.unsplash.com/photo-1544081044-659f899e320d?w=800', flight: 'Air France', hotel: 'Disney Explorers' },
    { id: 5, category: 'GROUP', title: 'Dubai Desert Safari Adventure', price: 42000, img: 'https://images.unsplash.com/photo-1512453979798-5ea440f58d23?w=800', flight: 'SpiceJet', hotel: 'Atlantis Palm' },
];

const Packages = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('ALL');
    const [bookingStep, setBookingStep] = useState('list');
    const [selectedPkg, setSelectedPkg] = useState(null);

    const filtered = filter === 'ALL' ? MOCK_PACKAGES : MOCK_PACKAGES.filter(p => p.category === filter);

    // MOCK SQUARING FLOW (JUST LIKE FLIGHTS)
    const handlePackageBook = async () => {
        alert("Local Data Square: Generating Package Receipt...");
        setTimeout(() => {
            alert(`🎉 Success! Package Squaring Complete. \nRef: PKG_LOC_${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
            navigate('/my-bookings');
        }, 1500);
    };

    return (
        <div className="packages-page container">
            <h2 className="section-title">All-Inclusive Travel Packages</h2>
            
            {/* Category Filter Bar */}
            <div className="package-filters">
                {['ALL', 'HONEYMOON', 'HOLIDAY', 'WEEKEND', 'FAMILY', 'GROUP'].map(cat => (
                    <button 
                        key={cat} 
                        className={`filter-chip ${filter === cat ? 'active' : ''}`}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {bookingStep === 'list' ? (
                <div className="package-grid">
                    {filtered.map(pkg => (
                        <div key={pkg.id} className="pkg-card">
                            <div className="pkg-img-box">
                                <img src={pkg.img} alt={pkg.title} />
                                <span className="pkg-cat-tag">{pkg.category}</span>
                            </div>
                            <div className="pkg-info">
                                <h3>{pkg.title}</h3>
                                <div className="pkg-inclusions">
                                    <span><MdFlight /> {pkg.flight} Inclusion</span>
                                    <span><MdHotel /> {pkg.hotel} Inclusion</span>
                                </div>
                                <div className="pkg-footer">
                                    <div className="pkg-price">₹{pkg.price.toLocaleString()} <span>/Couple</span></div>
                                    <button onClick={() => { setSelectedPkg(pkg); setBookingStep('detail'); }}>
                                        View Deal
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="pkg-detail-view">
                   <div className="detail-card">
                        <img src={selectedPkg.img} alt="header" />
                        <div className="content">
                            <h1>{selectedPkg.title} Bundle</h1>
                            <div className="bundle-grid">
                                <div className="bundle-item">
                                    <h4><MdFlight /> In-Flight Service</h4>
                                    <p>Round-trip with {selectedPkg.flight} (Includes Baggage & Meal)</p>
                                </div>
                                <div className="bundle-item">
                                    <h4><MdHotel /> Premium Accommodation</h4>
                                    <p>Standard Double Room at {selectedPkg.hotel} for 3-4 Nights.</p>
                                </div>
                            </div>
                            <div className="pricing-box">
                                <h2>₹{selectedPkg.price.toLocaleString()}</h2>
                                <button className="book-pkg-btn" onClick={handlePackageBook}>Confirm & Square Locally</button>
                                <button className="back-btn" onClick={() => setBookingStep('list')}>Cancel</button>
                            </div>
                        </div>
                   </div>
                </div>
            )}
        </div>
    );
};

export default Packages;