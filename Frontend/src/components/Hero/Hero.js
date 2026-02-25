import React, { useState, useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

// React Icons Imports
import { 
  MdFlight, MdHotel, MdUmbrella, MdAirplanemodeActive, 
  MdLanguage, MdSwapHoriz, MdGroups, MdLocationOn, 
  MdCardGiftcard, MdArrowBack, MdCheckCircle ,MdChevronLeft, 
  MdChevronRight 
} from "react-icons/md";
import { FaBoxOpen, FaChair } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();

  // --- States for Search Filters (Fixed Definitions) ---
  const [activeTab, setActiveTab] = useState('flights');
  const [tripType, setTripType] = useState('domestic'); 
  const [journeyType, setJourneyType] = useState('round-trip');
  const [from, setFrom] = useState(''); 
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState(''); 
  const [returnDate, setReturnDate] = useState(''); 

  // --- State for Partner Spotlight ---
  const [selectedPartner, setSelectedPartner] = useState(null); 

  // Auto-scroll to top when opening a partner spotlight
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPartner]);

  // --- Airline Partners Data (Extended for Spotlight) ---
  const airlinePartners = [
    { 
      name: "AirAsia", 
      tagline: "NOW EVERYONE CAN FLY",
      heroImg: "https://images.unsplash.com/photo-1543716627-839b54c40519?auto=format&fit=crop&w=1600&q=80",
      stats: "Over 130 Destinations",
      achievements: ["World's Best Low-Cost Airline 15 Years Running", "Digital Transformation Award 2024"],
      directFlights: [
        { city: "Kuala Lumpur", country: "Malaysia", img: "https://static2.tripoto.com/media/filter/tst/img/4335/TripDocument/1455120793_tui_india.jpg" },
        { city: "Phuket", country: "Thailand", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400" },
        { city: "Bangkok", country: "Thailand", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400" }
      ],
      topPicks: [
        { name: "PHUKET", img: "https://www.andamandaphuket.com/sites/andamanda/files/inline-images/admd%20phuket.jpg" },
        { name: "BANGKOK", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800" },
        { name: "SYDNEY", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800" },
        { name: "TOKYO", img: "https://www.universalweather.com/blog/wp-content/uploads/2019/07/tokyo-ops-7-19.jpg" }
      ],
      img: "https://airinsight.com/wp-content/uploads/2020/07/A330-900-Thai-AirAsia-X-MSN1901-Take-Off-1.jpg" 
    },
    { 
      name: "Air India", 
      tagline: "WINDOW TO THE WORLD",
      heroImg: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=80",
      stats: "Global Network Expansion",
      achievements: ["Airbus & Boeing Mega-Order 2023", "World's Best Long Haul Transformation"],
      directFlights: [
        { city: "New York", country: "USA", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400" },
        { city: "London", country: "UK", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400" },
        { city: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400" }
      ],
      topPicks: [
        { name: "DELHI", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800" },
        { name: "LONDON", img: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800" }
      ],
      img: "https://assets.cntraveller.in/photos/64d61d2f500968bfe5b8a97b/1:1/w_2490,h_2490,c_limit/Air-India-3.jpg" 
    },

    { 
      name: "Malaysia Airlines", 
      tagline: "MALAYSIAN HOSPITALITY",
      heroImg: "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?w=1600",
      stats: "Voted #1 Cabin Crew",
      achievements: ["5-Star Airline Skytrax Rating", "ASEAN Best Business Class 2024"],
      directFlights: [
        { city: "Kuala Lumpur", country: "MAS", img: "https://images.pexels.com/photos/313032/pexels-photo-313032.jpeg" },
        { city: "Singapore", country: "SIN", img: "https://images.unsplash.com/photo-1525596662741-e94ff9f26de1?w=400" }
      ],
      topPicks: [{ name: "MALAYSIA", img: "https://thumbs.dreamstime.com/b/beautiful-architecture-building-exterior-kuala-lumpur-city-malaysia-travel-150132862.jpg" }],
      img: "https://d3lcr32v2pp4l1.cloudfront.net/Pictures/2000xAny/7/9/4/78794_malaysia_airlines_a380841_9mmna_pushback_at_london_heathrow_airport_223279.jpg" 
    },
    { 
      name: "IndiGO", 
      tagline: "ON TIME EVERY TIME",
      heroImg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600",
      stats: "60% Market Share in India",
      achievements: ["Best Budget Airline in Central Asia", "Operational Excellence Award 2024"],
      directFlights: [
        { city: "Dubai", country: "UAE", img: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg" },
        { city: "Mumbai", country: "IND", img: "https://housiey.com/blogs/wp-content/uploads/2025/09/Top-10-Most-Expensive-Areas-in-Mumbai-in-2025-Houseiy.png" }
      ],
      topPicks: [{ name: "DUBAI", img: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg"},
        { name: "PARIS", img: "https://images.stockcake.com/public/4/0/8/4085bd8b-9796-4f83-a37e-581d0d700ef8_large/sunset-at-eiffel-stockcake.jpg" }
      ],
      img: "https://www.destinationlemonde.com/wp-content/uploads/2023/07/IndiGo-Airlines.jpg" 
    },

     { 
      name: "Air India Express", 
      tagline: "ON TIME EVERY TIME",
      heroImg: "https://www.shutterstock.com/image-vector/delhi-skyline-new-city-line-600nw-2384628217.jpg",
      stats: "60% Market Share in India",
      achievements: ["Best Budget Airline in Central Asia", "Operational Excellence Award 2024"],
      directFlights: [
        { city: "Dubai", country: "Gujarat", img: "https://www.greavesindia.com/wp-content/uploads/2017/01/TOMB-OF-BAHAR-UD-DIN-BHAR-IN-MAHABAT-MAQBARA-JUNAGADH-GUJARAT-INDIA-RL3B5272.CR2_.jpg" },
        { city: "Mumbai", country: "IND", img: "https://www.shutterstock.com/image-vector/delhi-skyline-new-city-line-600nw-2384628217.jpg" }
      ],
      topPicks: [{ name: "DUBAI", img: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg" }],
      img: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg" 
    },

      { 
      name: "Emirates", 
      tagline: "ON TIME EVERY TIME",
      heroImg: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg",
      stats: "60% Market Share in India",
      achievements: ["Best Budget Airline in Central Asia", "Operational Excellence Award 2024"],
      directFlights: [
        { city: "Dubai", country: "Gujarat", img: "https://www.greavesindia.com/wp-content/uploads/2017/01/TOMB-OF-BAHAR-UD-DIN-BHAR-IN-MAHABAT-MAQBARA-JUNAGADH-GUJARAT-INDIA-RL3B5272.CR2_.jpg" },
        { city: "Mumbai", country: "Paries", img: "https://png.pngtree.com/thumb_back/fh260/background/20240814/pngtree-view-on-downtown-of-paris-at-night-france-image_16132679.jpg" }
      ],
      topPicks: [{ name: "DUBAI", img: "https://deih43ym53wif.cloudfront.net/dubai-palm-jumeirah-island-shutterstock_1291548640.jpg_3ab124c2b9.jpg" },

         { name: "DELHI", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800" },
        { name: "LONDON", img: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800" }
      ],
        
      img: "https://www.destinationlemonde.com/wp-content/uploads/2023/07/IndiGo-Airlines.jpg" 
    },
 { 
      name: "flydubai", 
      tagline: "NOW EVERYONE CAN FLY",
      heroImg: "https://images.unsplash.com/photo-1543716627-839b54c40519?auto=format&fit=crop&w=1600&q=80",
      stats: "Over 130 Destinations",
      achievements: ["World's Best Low-Cost Airline 15 Years Running", "Digital Transformation Award 2024"],
      directFlights: [
        { city: "Kuala Lumpur", country: "Malaysia", img: "https://static2.tripoto.com/media/filter/tst/img/4335/TripDocument/1455120793_tui_india.jpg" },
        { city: "Phuket", country: "Thailand", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400" },
        { city: "Bangkok", country: "Thailand", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400" }
      ],
      topPicks: [
        { name: "PHUKET", img: "https://www.andamandaphuket.com/sites/andamanda/files/inline-images/admd%20phuket.jpg" },
        { name: "BANGKOK", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800" },
        { name: "SYDNEY", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800" },
        { name: "TOKYO", img: "https://www.universalweather.com/blog/wp-content/uploads/2019/07/tokyo-ops-7-19.jpg" }
      ],
      img: "https://airinsight.com/wp-content/uploads/2020/07/A330-900-Thai-AirAsia-X-MSN1901-Take-Off-1.jpg" 
    },

     { 
      name: "SpiceJet", 
      tagline: "NOW EVERYONE CAN FLY",
      heroImg: "https://images.unsplash.com/photo-1543716627-839b54c40519?auto=format&fit=crop&w=1600&q=80",
      stats: "Over 130 Destinations",
      achievements: ["World's Best Low-Cost Airline 15 Years Running", "Digital Transformation Award 2024"],
      directFlights: [
        { city: "Kuala Lumpur", country: "Malaysia", img: "https://static2.tripoto.com/media/filter/tst/img/4335/TripDocument/1455120793_tui_india.jpg" },
        { city: "Phuket", country: "Thailand", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400" },
        { city: "Bangkok", country: "Thailand", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400" }
      ],
      topPicks: [
        { name: "PHUKET", img: "https://www.andamandaphuket.com/sites/andamanda/files/inline-images/admd%20phuket.jpg" },
        { name: "BANGKOK", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800" },
        { name: "SYDNEY", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800" },
        { name: "TOKYO", img: "https://www.universalweather.com/blog/wp-content/uploads/2019/07/tokyo-ops-7-19.jpg" }
      ],
      img: "https://airinsight.com/wp-content/uploads/2020/07/A330-900-Thai-AirAsia-X-MSN1901-Take-Off-1.jpg" 
    },
     { 
      name: "Akasa Air", 
      tagline: "NOW EVERYONE CAN FLY",
      heroImg: "https://images.unsplash.com/photo-1543716627-839b54c40519?auto=format&fit=crop&w=1600&q=80",
      stats: "Over 130 Destinations",
      achievements: ["World's Best Low-Cost Airline 15 Years Running", "Digital Transformation Award 2024"],
      directFlights: [
        { city: "Kuala Lumpur", country: "Malaysia", img: "https://static2.tripoto.com/media/filter/tst/img/4335/TripDocument/1455120793_tui_india.jpg" },
        { city: "Phuket", country: "Thailand", img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400" },
        { city: "Bangkok", country: "Thailand", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400" }
      ],
      topPicks: [
        { name: "PHUKET", img: "https://www.andamandaphuket.com/sites/andamanda/files/inline-images/admd%20phuket.jpg" },
        { name: "BANGKOK", img: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800" },
        { name: "SYDNEY", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800" },
        { name: "TOKYO", img: "https://www.universalweather.com/blog/wp-content/uploads/2019/07/tokyo-ops-7-19.jpg" }
      ],
      img: "https://airinsight.com/wp-content/uploads/2020/07/A330-900-Thai-AirAsia-X-MSN1901-Take-Off-1.jpg" 
    }


    // Adding minimal objects for other partners to prevent breakage
   
   
   ];

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };
 
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = 300; // Adjust this based on card width
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  const handleSearch = () => {
    if (activeTab === 'flights') {
      if (!from || !to) { alert("Please enter both 'From' and 'To' locations"); return; }
      navigate('/flights', { state: { from, to, tripType, journeyType, departDate } });
    } 
    else if (activeTab === 'hotels') {
      if (!from) { alert("Please enter a destination city"); return; }
      navigate('/hotels', { state: { initialSearch: from } });
    } 
    else if (activeTab === 'packages') {
      navigate('/packages', { state: { searchTerm: from || 'ALL' } });
    }
    else if (activeTab === 'activities') {
      navigate('/activities', { state: { citySearch: from } });
    }
  };

  // --- RENDER SPOTLIGHT VIEW (IF A PARTNER IS SELECTED) ---
  if (selectedPartner && selectedPartner.tagline) {
    return (
      <div className="partner-spotlight-page">
        <header className="spotlight-hero" style={{ backgroundImage: `url(${selectedPartner.heroImg})` }}>
          <button className="back-home-btn" onClick={() => setSelectedPartner(null)}>
            <MdArrowBack /> Exit to Search
          </button>
          <div className="spotlight-hero-text">
            <h1>{selectedPartner.tagline}</h1>
          </div>
        </header>

        <div className="spotlight-container">
          <section className="spotlight-content-card container">
            <h2 className="title-with-line">Fly to Over {selectedPartner.stats}</h2>
            <div className="achievements-section">
                {selectedPartner.achievements.map((item, idx) => (
                    <div className="achievement-item" key={idx}><MdCheckCircle className="icon" /> {item}</div>
                ))}
            </div>

            <h3 className="title-with-line center">Direct Flights</h3>
            <div className="circle-flights-grid">
                {selectedPartner.directFlights.map((item, idx) => (
                    <div className="circle-item" key={idx}>
                        <img src={item.img} alt={item.city} />
                        <h4>{item.city}</h4>
                        <p>{item.country}</p>
                    </div>
                ))}
            </div>

            <h3 className="title-with-line center">In-Flight Experiences</h3>
            <div className="experience-banner">
                <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80" alt="Experience" />
            </div>
          </section>

          <section className="top-picks-section container">
            <h2 className="title-with-line center">{selectedPartner.name}'s Top Picks</h2>
            <div className="picks-grid">
                {selectedPartner.topPicks?.map((pick, idx) => (
                    <div key={idx} className="pick-card-tall" style={{backgroundImage: `url(${pick.img})`}}>
                        <h3>{pick.name}</h3>
                    </div>
                ))}
            </div>
            <button className="sticky-footer-search" onClick={() => { setSelectedPartner(null); window.scrollTo(0,0); }}>
               SEARCH {selectedPartner.name.toUpperCase()} FLIGHTS
            </button>
          </section>
        </div>
      </div>
    );
  }

  // --- RENDER NORMAL HOME VIEW ---
  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <h1>Explore the World with <span>TravelGo</span></h1>
          <p>Book the best deals on domestic and international flights, luxury hotels, and vacation packages!</p>
        </div>
      </header>

      <section className="search-section">
        <div className="container">
          <div className="search-container">
            
            {/* 1. MAIN TABS */}
            <div className="tabs">
              <button className={`tab ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')}>
                <MdFlight size={20} /> Flights
              </button>
              <button className={`tab ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}>
                <MdHotel size={20} /> Hotels
              </button>
              <button className={`tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
                <FaBoxOpen size={18} /> Packages
              </button>
              <button className={`tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
                <MdUmbrella size={20} /> Activities
              </button>
            </div>

            {/* 2. FLIGHT OPTIONS */}
            {activeTab === 'flights' && (
              <div className="flight-sub-options">
                <div className="toggle-group">
                  <label className={`scope-label ${tripType === 'domestic' ? 'active' : ''}`}>
                    <input type="radio" name="scope" onChange={() => setTripType('domestic')} checked={tripType === 'domestic'} />
                    <MdAirplanemodeActive /> Domestic
                  </label>
                  <label className={`scope-label ${tripType === 'international' ? 'active' : ''}`}>
                    <input type="radio" name="scope" onChange={() => setTripType('international')} checked={tripType === 'international'} />
                    <MdLanguage /> International
                  </label>
                  <div className="divider-line"></div>
                  <select className="ghost-select" value={journeyType} onChange={(e) => setJourneyType(e.target.value)}>
                    <option value="round-trip">Round Trip</option>
                    <option value="one-way">One Way</option>
                  </select>
                </div>
                <div className="extra-selects">
                  <div className="sub-input-group">
                    <FaChair size={14} />
                    <select><option>Economy</option><option>Business</option><option>First Class</option></select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DYNAMIC SEARCH INPUTS */}
            <div className="search-inputs">
              <div className="input-group">
                <label>
                    {activeTab === 'flights' ? "From:" : 
                     activeTab === 'packages' ? "Select Package Theme:" : 
                     activeTab === 'activities' ? "City for Experience:" : 
                     "Destination / Hotel:"}
                </label>
                <div className="select-wrapper">
                    {activeTab === 'packages' ? (
                        <>
                            <MdCardGiftcard className="select-icon" />
                            <select value={from} onChange={(e) => setFrom(e.target.value)} style={{paddingLeft: '35px'}}>
                                <option value="ALL">All Special Offers</option>
                                <option value="HONEYMOON">Honeymoon Specials</option>
                                <option value="HOLIDAY">Holiday Escapes</option>
                                <option value="WEEKEND">Weekend Getaways</option>
                                <option value="FAMILY">Family & Kids Special</option>
                                <option value="GROUP">Group Tours</option>
                            </select>
                        </>
                    ) : (
                        <>
                            {(activeTab === 'hotels' || activeTab === 'activities') && <MdLocationOn className="select-icon" />}
                            <input 
                                type="text" 
                                value={from}
                                style={{paddingLeft: (activeTab === 'hotels' || activeTab === 'activities') ? '35px' : '12px'}}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder={
                                  activeTab === 'flights' ? "Enter City" : 
                                  activeTab === 'activities' ? "e.g. Goa, Dubai" : 
                                  "Where are you going?"
                                } 
                            />
                        </>
                    )}
                </div>
              </div>

              {activeTab === 'flights' && (
                <>
                  <button className="swap-btn" onClick={handleSwap}><MdSwapHoriz size={24} /></button>
                  <div className="input-group">
                    <label>To:</label>
                    <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Enter Destination" />
                  </div>
                </>
              )}

              <div className="input-group">
                <label>{activeTab === 'flights' ? "Depart:" : "Check-in Date:"}</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
              </div>

              {(activeTab === 'hotels' || activeTab === 'activities' || (activeTab === 'flights' && journeyType === 'round-trip') || activeTab === 'packages') && (
                <div className="input-group">
                  <label>{activeTab === 'flights' ? "Return:" : "Check-out Date:"}</label>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </div>
              )}

              <div className="input-group">
                <label>{activeTab === 'flights' ? "Travelers:" : "Guests & Rooms:"}</label>
                <div className="select-wrapper">
                   <MdGroups className="select-icon" />
                   <select>
                    <option>{activeTab === 'flights' ? "1 Adult" : "1 Room, 2 Guests"}</option>
                    <option>{activeTab === 'flights' ? "2 Adults" : "2 Rooms, 4 Guests"}</option>
                  </select>
                </div>
              </div>

              <button className="search-btn" onClick={handleSearch}>
                {activeTab === 'flights' ? 'Search Flights' : 
                 activeTab === 'packages' ? 'Explore Packages' : 
                 activeTab === 'activities' ? 'Find Activities' : 
                 'Search Hotels'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AIRLINE PARTNERS SECTION */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-title">Official Airline Partners</h2>
          
          <div className="partners-wrapper">
            {/* Left Button */}
            <button className="nav-btn left" onClick={() => scroll('left')}>
              <MdChevronLeft size={30} />
            </button>

            <div className="partners-grid" ref={scrollRef}>
              {airlinePartners.map((airline, index) => (
                <div key={index} className="partner-banner-card" onClick={() => setSelectedPartner(airline)}>
                  <div className="partner-content">
                     <h3>{airline.name}</h3>
                     <span className="spotlight-badge">Click to see Achievements</span>
                  </div>
                  <div className="tail-decor" style={{ backgroundImage: `url(${airline.img})` }}></div>
                </div>
              ))}
            </div>

            {/* Right Button */}
            <button className="nav-btn right" onClick={() => scroll('right')}>
              <MdChevronRight size={30} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;