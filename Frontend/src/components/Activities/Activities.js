import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTimer, MdLocationOn, MdShield, MdAddCircle, MdCloudUpload } from 'react-icons/md';
import './Activities.css';

const Activities = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    
    // States for adding a new Event (Ensuring keys match Schema exactly)
    const [formData, setFormData] = useState({ 
        title: '', 
        city: '', 
        price: '', 
        duration: '', 
        description: '' 
    });

    const themes = ['ALL', 'ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'];

    const loadData = () => {
        // Points to your Live Render Backend
        fetch(`https://travelgo-v7ha.onrender.com/api/activities?theme=${filter}`)
            .then(res => {
                if (!res.ok) throw new Error("Backend Offline");
                return res.json();
            })
            .then(data => {
                setActivities(Array.isArray(data) ? data.reverse() : []);
            })
            .catch(err => console.error("Sync Error:", err));
    };

    useEffect(() => { loadData(); }, [filter]);

    /**
     * LOGIC: SAVE NEW EVENT
     * Prevents 400 Bad Request by squaring types before sending.
     */
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        // 1. Database Square: MongoDB enum doesn't allow 'ALL'
        if (filter === 'ALL') {
            alert("⚠️ Please select a specific category tab (like WATER or FOOD) before registering.");
            return;
        }

        // 2. Data Preparation: Matches Schema expectations
        const payload = {
            title: formData.title.trim(),
            city: formData.city.trim(),
            theme: filter,                // Injects the current selected category
            price: Number(formData.price), // FORCES String to Number
            duration: formData.duration.trim(),
            description: formData.description.trim()
        };

        // 3. Client Validation
        if (!payload.title || !payload.city || isNaN(payload.price)) {
            alert("❌ Missing fields or invalid price format.");
            return;
        }

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/activities/create-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok) { 
                alert(`✅ ${filter} Service Saved Successfully!`); 
                setShowForm(false); 
                setFormData({ title: '', city: '', price: '', duration: '', description: '' });
                loadData(); 
            } else {
                // If it still 400s, this shows the exact validation rule from Mongoose
                alert(`❌ Server Rejected Data: ${result.error || "Mismatched Logic"}`);
            }
        } catch (err) {
            alert("🌐 Connection Error: Is the Backend running?");
        }
    };

    /**
     * LOGIC: LOCAL TRANSACTION SQUARING
     */
    const handleSquaring = async () => {
        setIsBusy(true);
        const email = localStorage.getItem('userEmail') || "traveler@travelgo.com";
        try {
            // STEP 1: CREATE INTENT (POST)
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/activities/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    activityName: selected.title,
                    userEmail: email, 
                    amountPaid: selected.price 
                })
            });
            const order = await res.json();

            // STEP 2: VERIFY/SQUARE TRANSACTION (PATCH)
            const verify = await fetch(`https://travelgo-v7ha.onrender.com/api/activities/confirm/${order._id}`, { method: 'PATCH' });
            const final = await verify.json();
            
            alert(`🎉 Success! Booking Squared.\nTRX Proof: ${final.transaction_id}`);
            navigate('/my-bookings');
        } catch (e) {
            alert("⚠️ Squaring Process Failed.");
        } finally {
            setIsBusy(false);
            setSelected(null);
        }
    };

    return (
        <div className="activities-page">
            <div className="act-banner">
                <h1>{filter === 'ALL' ? 'Verified Local Experiences' : `${filter} Hub`}</h1>
                <p>Curated and squared directly via TravelGo Cloud DB. Fast, image-free delivery.</p>
            </div>

            <div className="container">
                <div className="act-controls">
                    <div className="category-bar">
                        {themes.map(t => (
                            <button key={t} className={filter === t ? 'active' : ''} 
                                    onClick={() => {setFilter(t); setShowForm(false);}}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {filter !== 'ALL' && (
                        <button className="add-event-btn" onClick={() => setShowForm(!showForm)}>
                            <MdAddCircle /> {showForm ? 'Close Form' : `Register ${filter}`}
                        </button>
                    )}
                </div>

                {/* EVENT CREATION DRAWER */}
                {showForm && (
                    <div className="form-container">
                        <h3><MdCloudUpload /> Database Registration: {filter}</h3>
                        <form onSubmit={handleCreateEvent}>
                            <div className="row">
                                <input type="text" placeholder="Official Title" value={formData.title} required onChange={e=>setFormData({...formData, title:e.target.value})} />
                                <input type="text" placeholder="Operation City" value={formData.city} required onChange={e=>setFormData({...formData, city:e.target.value})} />
                            </div>
                            <div className="row">
                                <input type="number" placeholder="Cost per Slot (Numbers Only)" value={formData.price} required onChange={e=>setFormData({...formData, price:e.target.value})} />
                                <input type="text" placeholder="Service Duration" value={formData.duration} required onChange={e=>setFormData({...formData, duration:e.target.value})} />
                            </div>
                            <textarea placeholder="Write description to be squared in cloud database..." value={formData.description} required onChange={e=>setFormData({...formData, description:e.target.value})} />
                            <button type="submit" className="save-btn">Verify and Push to DB</button>
                        </form>
                    </div>
                )}

                {/* GRID VIEW */}
                <div className="activities-grid">
                    {activities.map(act => (
                        <div key={act._id} className="act-card">
                            <div className="theme-header" style={{backgroundColor: 
                                act.theme === 'WATER' ? '#0ea5e9' : 
                                act.theme === 'ADVENTURE' ? '#10b981' : 
                                act.theme === 'FOOD' ? '#f3a614' : '#6366f1'}}>
                                <MdShield /> TravelGo Verified
                            </div>
                            <div className="act-card-content">
                                <span className="cat-badge">{act.theme} Experience</span>
                                <h3>{act.title}</h3>
                                <p className="desc">{act.description}</p>
                                <div className="meta">
                                    <span><MdLocationOn /> {act.city}</span>
                                    <span><MdTimer /> {act.duration}</span>
                                </div>
                                <div className="footer">
                                    <div className="price-tag">
                                        <small>Fee</small>
                                        <strong>₹{Number(act.price || 0).toLocaleString()}</strong>
                                    </div>
                                    <button onClick={() => setSelected(act)}>Secure Ticket</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!loading && activities.length === 0 && <p className="empty-msg">Vault is empty for {filter} category. Register your service first!</p>}
                </div>
            </div>

            {/* MODAL: THE SQUARE DIALOG */}
            {selected && (
                <div className="modal">
                    <div className="modal-inner">
                        <h2>Confirm Square</h2>
                        <p>{selected.title}</p>
                        <div className="alert-square">
                            Confirm unique vault identity for this activity.
                        </div>
                        <div className="total-due">Price: <b>₹{Number(selected.price).toLocaleString()}</b></div>
                        <button className="finalize-btn" onClick={handleSquaring} disabled={isBusy}>
                            {isBusy ? 'Syncing ID...' : `Confirm & Square Locally`}
                        </button>
                        <button className="close-link" onClick={() => setSelected(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activities;