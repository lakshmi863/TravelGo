// 1. MUST BE FIRST: Load Environment Variables
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 2. Route & Model Imports
const userRouter = require('./src/Routers/userRouter'); 
const activityRouter = require('./src/Routers/activityRouter');
const aiRoutes = require('./src/Routers/aiRoutes'); // Handle AI via the router
const UserModel = require('./src/Models/UserModel'); 
const HotelBooking = require('./src/Models/HotelBookingModel'); 

// 3. Utility Imports
const sendHotelConfirmation = require('./src/utils/hotelEmail');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// SECURITY: RATE LIMITERS (Protects your system from spam)
// ---------------------------------------------------------

const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Too many booking attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 15, 
    message: { error: "Security Lock: Too many login attempts. Try again in 1 hour." }
});

// ---------------------------------------------------------
// MIDDLEWARE
// ---------------------------------------------------------
app.use(helmet()); 
app.use(cors({
    origin: ["http://localhost:3000", "https://travelgo-front.onrender.com"],
    credentials: true
}));
app.use(express.json()); 

// Initialize Databases
UserModel(); // SQLite Table Creation

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
      .then(() => console.log('✅ Connected to MongoDB Atlas'))
      .catch(err => console.error('❌ MongoDB Connection Error:', err.message));
} else {
    console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

/**
 * @route   POST /api/hotels/book
 * @desc    Hotel booking logic with MongoDB & Email logic
 */
app.post('/api/hotels/book', bookingLimiter, async (req, res) => {
    try {
        const booking = new HotelBooking(req.body);
        const savedBooking = await booking.save();
        
        try {
            await sendHotelConfirmation(savedBooking);
        } catch (emailError) {
            console.error("📧 Email Warning:", emailError.message);
        }

        res.status(201).json({ message: "Success", booking: savedBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/hotels/my-bookings/:email
 */
app.get('/api/hotels/my-bookings/:email', async (req, res) => {
    try {
        const bookings = await HotelBooking.find({ passengerEmail: req.params.email }).sort({ bookedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clean Modular Routes
app.use('/api/activities', activityRouter);
app.use('/api/users', authLimiter, userRouter); 
app.use('/api/ai', aiRoutes); // Use the router we imported (prevents ReferenceErrors)

// ---------------------------------------------------------
// SERVER INITIALIZATION
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).send("TravelGo Production Backend is Online!");
});

app.listen(PORT, () => {
  console.log(`🚀 TravelGo Server is squared and running on port ${PORT}`);
});