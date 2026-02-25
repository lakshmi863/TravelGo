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
    
    // States for adding a new Event
    const [formData, setFormData] = useState({ 
        title: '', city: '', price: '', duration: '', image: '', description: '' 
    });

    const themes = ['ALL', 'ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'];

    const loadData = () => {
        // Ensure you point to your Node backend Port 5000
        fetch(`http://localhost:5000/api/activities?theme=${filter}`)
            .then(res => res.json())
            .then(data => {
                // Sorting newly added items to the top
                setActivities(Array.isArray(data) ? data.reverse() : []);
            })
            .catch(err => console.error("Database connection issue: ", err));
    };

    useEffect(() => { loadData(); }, [filter]);

    // Handle saving new activities (ADVENTURE, WATER, etc) to MongoDB
    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/activities/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, theme: filter })
        });
        if (res.ok) { 
            alert(`✅ ${filter} Event Saved to Database!`); 
            setShowForm(false); 
            setFormData({ title: '', city: '', price: '', duration: '', image: '', description: '' });
            loadData(); 
        }
    };

    // Logic for Final Squaring (The confirmation logic)
    const handleSquaring = async () => {
        setIsBusy(true);
        const email = localStorage.getItem('userEmail') || "traveler@travelgo.com";
        
        try {
            // Initiate Booking Status
            const res = await fetch('http://localhost:5000/api/activities/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    activityId: selected._id, 
                    passengerName: "Local User", 
                    passengerEmail: email, 
                    amount: selected.price 
                })
            });
            const order = await res.json();
            
            // Squaring transaction ref in Local MongoDB
            const verify = await fetch(`http://localhost:5000/api/activities/verify/${order._id}`, { method: 'PATCH' });
            const final = await verify.json();
            
            alert(`Booking Squared Successfully!\nTransaction Proof: ${final.transaction_id}`);
            navigate('/my-bookings');
        } catch (e) {
            alert("Local storage failed.");
        } finally {
            setIsBusy(false);
            setSelected(null);
        }
    };

    return (
        <div className="activities-page">
            <div className="act-banner">
                <h1>{filter === 'ALL' ? 'Local TravelGo Experiences' : `${filter} Tours`}</h1>
                <p>Curated and squared locally. No external bank dependency.</p>
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
                            <MdAddCircle /> {showForm ? 'Cancel' : `Create ${filter}`}
                        </button>
                    )}
                </div>

                {/* CREATION FORM */}
                {showForm && (
                    <div className="form-container">
                        <h3><MdCloudUpload /> Register {filter} Service</h3>
                        <form onSubmit={handleCreateEvent}>
                            <div className="row">
                                <input type="text" placeholder="Title" value={formData.title} required onChange={e=>setFormData({...formData, title:e.target.value})} />
                                <input type="text" placeholder="City" value={formData.city} required onChange={e=>setFormData({...formData, city:e.target.value})} />
                            </div>
                            <div className="row">
                                <input type="number" placeholder="Price (Amount)" value={formData.price} required onChange={e=>setFormData({...formData, price:e.target.value})} />
                                <input type="text" placeholder="Duration (e.g. 4 hrs)" value={formData.duration} required onChange={e=>setFormData({...formData, duration:e.target.value})} />
                            </div>
                            <input type="text" placeholder="Direct Image URL" value={formData.image} required onChange={e=>setFormData({...formData, image:e.target.value})} />
                            <textarea placeholder="Event Description..." value={formData.description} required onChange={e=>setFormData({...formData, description:e.target.value})} />
                            <button type="submit" className="save-btn">Store Event in Local DB</button>
                        </form>
                    </div>
                )}

                {/* LISTING GRID */}
                <div className="activities-grid">
                    {activities.map(act => (
                        <div key={act._id} className="act-card">
                            <div className="img-holder">
                                <img src={act.image} alt={act.title} />
                                <span className="cat-label">{act.theme}</span>
                            </div>
                            <div className="act-card-content">
                                <h3>{act.title}</h3>
                                <p className="desc-text">{act.description}</p>
                                <div className="meta">
                                    <span><MdLocationOn /> {act.city}</span>
                                    <span><MdTimer /> {act.duration}</span>
                                </div>
                                <div className="footer">
                                    <div className="price-tag">
                                        <small>Local Fee</small>
                                        {/* FIX: Ensure act.price is treated as a number */}
                                        <strong>₹{Number(act.price || 0).toLocaleString('en-IN')}</strong>
                                    </div>
                                    <button className="sel-act-btn" onClick={() => setSelected(act)}>Select Activity</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && <p className="empty-msg">No results in {filter} category. Create one above!</p>}
                </div>
            </div>

            {/* CONFIRMATION DIALOG (SQUARING) */}
            {selected && (
                <div className="modal">
                    <div className="modal-inner">
                        <h2>{selected.title}</h2>
                        <p style={{fontSize:'14px', color: '#666'}}>{selected.city} Expedition</p>
                        <div className="alert-square">
                            <MdShield /> SQUARING DATA: Confirm unique transaction ref.
                        </div>
                        <div className="total-due">Final Amount: <b>₹{Number(selected.price || 0).toLocaleString('en-IN')}</b></div>
                        <button className="finalize-btn" onClick={handleSquaring} disabled={isBusy}>
                            {isBusy ? 'Verifying Reference...' : `Confirm & Square Locally`}
                        </button>
                        <button className="close-link" onClick={() => setSelected(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activities;