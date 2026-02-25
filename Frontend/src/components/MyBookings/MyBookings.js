import React, { useEffect, useState } from 'react';
import { 
  MdLocationOn, 
  MdMeetingRoom, 
  MdAccessTime, 
  MdSupportAgent,
  MdBadge, 
  MdFastfood, 
  MdRestaurantMenu,
  MdCheckCircle, 
  MdCancel,
  MdFlightTakeoff,
  MdBusinessCenter,
  MdInfoOutline,
  MdAttachMoney,
  MdEventSeat 
} from 'react-icons/md';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [isOrdering, setIsOrdering] = useState(null);

  const foodMenu = [
    { id: 'm1', name: "Veg Maharaja Meal", price: 480, desc: "Rice, Dal & Paneer", thumb: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150" },
    { id: 'm2', name: "Classic Chicken Grill", price: 590, desc: "Grilled Breast & Mash", thumb: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=150" },
    { id: 'm3', name: "Indi-Wraps Duo", price: 320, desc: "2 Fresh Tikka Rolls", thumb: "https://curlytales.com/wp-content/uploads/2025/10/Untitled-design-2025-10-13T182639.280.jpg" }
  ];

  // UPDATED: Fetch logic to filter by logged-in user email
  const fetchBookings = () => {
    const userEmail = localStorage.getItem('userEmail'); // Get email of current user
    
    if (!userEmail) {
        console.error("No logged-in user found.");
        setLoading(false);
        return;
    }

    // Pass the email as a query parameter to your Django API
    fetch(`http://127.0.0.1:8000/api/bookings/?email=${userEmail}`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Confirm cancellation? This will release your seat.")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel_ticket/`, { method: 'POST' });
      if (response.ok) { alert("Flight Cancelled."); fetchBookings(); }
    } catch (error) { alert("Error connecting to server."); }
  };

  const handleOrderFood = async (booking) => {
    const meal = selectedMeals[booking.id];
    if (!meal) { alert("Select a meal!"); return; }
    setIsOrdering(booking.id);
    const orderData = {
      passenger_name: booking.passenger_name,
      flight_number: `TG-REF-00${booking.id}`,
      seat_number: booking.seat_number,
      food_type: meal.name,
      price: meal.price.toString()
    };
    try {
      await fetch('http://127.0.0.1:8000/api/food-orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      alert(`🎉 Meal confirmed for Seat ${booking.seat_number}!`);
    } finally { setIsOrdering(null); }
  };

  const airportMocks = [
    { name: "Indira Gandhi International Airport", img: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800" },
    { name: "Chhatrapati Shivaji Maharaj Intl", img: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800" }
  ];

  if (loading) return <div className="loader"><span>Verifying Passenger Seat Assignments...</span></div>;

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <div className="bookings-header">
          <h2>Your Digital Boarding Passes</h2>
          {bookings.length === 0 && <p style={{color: '#666'}}>No active trips found for your account.</p>}
        </div>

        <div className="trips-list">
          {bookings.map((b, index) => {
            const mock = airportMocks[index % airportMocks.length];
            const currentMeal = selectedMeals[b.id];
            const isCancelled = b.status === 'CANCELLED';
            
            return (
              <div key={b.id} className={`trip-card ${isCancelled ? 'cancelled-card' : ''}`}>
                
                <div className="card-left-sidebar">
                  <div className="sidebar-image" style={{backgroundImage: `url(${mock.img})`}}>
                    <div className="seat-overlay">
                        <span>PASSENGER COPY</span>
                        <h3>SEAT {b.seat_number}</h3>
                    </div>
                  </div>

                  <div className="luggage-section">
                    <h4><MdBusinessCenter /> Baggage Policy</h4>
                    <div className="luggage-row"><span>Hand Bag</span><strong>7 Kg</strong></div>
                    <div className="luggage-row"><span>Check-in</span><strong>15 Kg</strong></div>

                    <div className="price-tag-box">
                      <MdAttachMoney />
                      <div>
                        <small>Extra Weight Pricing</small>
                        <p>₹450 / Per Kg</p>
                      </div>
                    </div>

                    <div className="travel-instructions">
                      <MdInfoOutline className="info-icon" />
                      <div>
                        <strong>Boarding Guide:</strong>
                        <p>• Reach 2h before flight</p>
                        <p>• Mask and Govt ID mandatory</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-details-side">
                  <div className="ticket-header">
                    <div className="travel-info">
                       <h3 className="route-text">
                          {b.flight_origin || "HYD"} 
                          <MdFlightTakeoff className="route-icon" /> 
                          {b.flight_destination || "MUMBAI"}
                       </h3>
                       <small>PNR: TG-BOK-00{b.id}PASS</small>
                    </div>
                    <div className={`status-pill ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                      {isCancelled ? <MdCancel /> : <MdCheckCircle />} {b.status}
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="grid-item full-width">
                      <label><MdLocationOn /> Departure Location</label>
                      <p>{mock.name}</p>
                    </div>
                    <div className="grid-item">
                      <label><MdMeetingRoom /> Gate / Terminal</label>
                      <p>GATE-B12 / T3</p>
                    </div>
                    
                    <div className="grid-item">
                      <label><MdEventSeat /> Assigned Seat</label>
                      <p style={{color: '#f3a614', fontWeight: '900'}}>{b.seat_number}</p>
                    </div>

                    <div className="grid-item">
                      <label><MdAccessTime /> Boarding Time</label>
                      <p>11:30 AM</p>
                    </div>
                    <div className="grid-item full-width">
                      <label><MdBadge /> Traveler</label>
                      <p style={{textTransform: 'uppercase'}}>{b.passenger_name}</p>
                    </div>
                  </div>

                  <div className="specialist-box">
                    <MdSupportAgent className="specialist-icon" />
                    <div>
                        <strong>Airport Ground Support</strong>
                        <span>Specialist "Amit K." assigned to Seat {b.seat_number}.</span>
                    </div>
                  </div>

                  {!isCancelled ? (
                    <button className="cancel-booking-btn" onClick={() => handleCancel(b.id)}>
                       Cancel Reservation
                    </button>
                  ) : (
                    <div className="cancelled-msg">Booking Status: Revoked</div>
                  )}
                </div>

                <div className="card-food-side">
                  <div className="food-header">
                    <MdFastfood style={{marginRight: '5px'}} />
                    <MdRestaurantMenu /> <span>Dining Orders</span>
                  </div>
                  
                  <div className="meal-scroller">
                    {foodMenu.map(meal => (
                      <div 
                        key={meal.id} 
                        className={`meal-card ${currentMeal?.id === meal.id ? 'active' : ''} ${isCancelled ? 'disabled-meal' : ''}`}
                        onClick={() => !isCancelled && setSelectedMeals({...selectedMeals, [b.id]: meal})}
                      >
                        <img src={meal.thumb} alt={meal.name} className="meal-thumb" />
                        <div className="meal-meta">
                          <strong>{meal.name}</strong>
                          <span className="meal-cost">₹{meal.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="meal-submit-btn" 
                    disabled={!currentMeal || isOrdering === b.id || isCancelled}
                    onClick={() => handleOrderFood(b)}
                  >
                    {isCancelled ? "N/A" : isOrdering === b.id ? "Ordering..." : "Finalize Order"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;