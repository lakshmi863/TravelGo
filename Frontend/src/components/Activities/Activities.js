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
    
    // Updated State: No image
    const [formData, setFormData] = useState({ 
        title: '', city: '', price: '', duration: '', description: '' 
    });

    const themes = ['ALL', 'ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'];

    const loadData = () => {
        fetch(`https://travelgo-v7ha.onrender.com/api/activities?theme=${filter}`)
            .then(res => res.json())
            .then(data => {
                setActivities(Array.isArray(data) ? data.reverse() : []);
            })
            .catch(err => console.error("Database connection issue: ", err));
    };

    useEffect(() => { loadData(); }, [filter]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        
        // Validation: MongoDB will give 400 error if we send "ALL"
        if (filter === 'ALL') {
            alert("Please select a specific Category first!");
            return;
        }

        // Final payload preparation
      const payload = {
            title: formData.title.trim(),
            city: formData.city.trim(),
            price: Number(formData.price), // IMPORTANT: Converts "500" -> 500
            theme: filter,
            duration: formData.duration.trim(),
            description: formData.description.trim()
        }
        const res = await fetch('https://travelgo-v7ha.onrender.com/api/activities/create-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) { 
            alert(`✅ ${filter} Service Registered!`); 
            setShowForm(false); 
            setFormData({ title: '', city: '', price: '', duration: '', description: '' });
            loadData(); 
        } else {
            const error = await res.json();
            alert("Error: " + error.error);
        }
    };

    const handleSquaring = async () => {
        setIsBusy(true);
        const email = localStorage.getItem('userEmail') || "traveler@travelgo.com";
        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/activities/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    activityId: selected._id, 
                    passengerName: "Traveler", 
                    passengerEmail: email, 
                    amount: selected.price 
                })
            });
            const order = await res.json();
            const verify = await fetch(`https://travelgo-v7ha.onrender.com/api/activities/confirm/${order._id}`, { method: 'PATCH' });
            const final = await verify.json();
            alert(`Squared!\nProof: ${final.transaction_id}`);
            navigate('/my-bookings');
        } catch (e) {
            alert("Transaction Error.");
        } finally {
            setIsBusy(false);
            setSelected(null);
        }
    };

    return (
        <div className="activities-page">
            <div className="act-banner">
                <h1>{filter === 'ALL' ? 'Local Experiences' : `${filter} Hub`}</h1>
                <p>Curated and squared locally. Fast verification.</p>
            </div>

            <div className="container">
                <div className="act-controls">
                    <div className="category-bar">
                        {themes.map(t => (
                            <button key={t} className={filter === t ? 'active' : ''} onClick={() => {setFilter(t); setShowForm(false);}}>
                                {t}
                            </button>
                        ))}
                    </div>
                    {filter !== 'ALL' && (
                        <button className="add-event-btn" onClick={() => setShowForm(!showForm)}>
                            <MdAddCircle /> {showForm ? 'Cancel' : `Register ${filter}`}
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="form-container">
                        <h3><MdCloudUpload /> Register New {filter} Activity</h3>
                        <form onSubmit={handleCreateEvent}>
                            <div className="row">
                                <input type="text" placeholder="Service Title" value={formData.title} required onChange={e=>setFormData({...formData, title:e.target.value})} />
                                <input type="text" placeholder="Location (City)" value={formData.city} required onChange={e=>setFormData({...formData, city:e.target.value})} />
                            </div>
                            <div className="row">
                                <input type="number" placeholder="Cost (₹)" value={formData.price} required onChange={e=>setFormData({...formData, price:e.target.value})} />
                                <input type="text" placeholder="Duration (e.g. 2 Hours)" value={formData.duration} required onChange={e=>setFormData({...formData, duration:e.target.value})} />
                            </div>
                            <textarea placeholder="Description of service..." value={formData.description} required onChange={e=>setFormData({...formData, description:e.target.value})} />
                            <button type="submit" className="save-btn">Store in Database</button>
                        </form>
                    </div>
                )}

                <div className="activities-grid">
                    {activities.map(act => (
                        <div key={act._id} className="act-card">
                            {/* Color Header instead of image */}
                            <div className="theme-header" data-theme={act.theme}>
                                <MdShield /> {act.theme} Verified
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
                                        <small>Fee</small>
                                        <strong>₹{Number(act.price || 0).toLocaleString()}</strong>
                                    </div>
                                    <button className="sel-act-btn" onClick={() => setSelected(act)}>Select</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selected && (
                <div className="modal">
                    <div className="modal-inner">
                        <h2>{selected.title}</h2>
                        <div className="total-due">Price: <b>₹{Number(selected.price).toLocaleString()}</b></div>
                        <button className="finalize-btn" onClick={handleSquaring} disabled={isBusy}>
                            {isBusy ? 'Verifying Reference...' : `Confirm & Square`}
                        </button>
                        <button className="close-link" onClick={() => setSelected(null)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activities;