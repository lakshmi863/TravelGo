// 1. ALWAYS LOAD ENVIRONMENT VARIABLES FIRST
require('dotenv').config(); // MUST BE THE VERY FIRST LINE

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Now import controllers

const userRouter = require('./src/Routers/userRouter'); 
const activityRouter = require('./src/Routers/activityRouter');
const db = require('./src/Config/db'); 
const UserModel = require('./src/Models/UserModel'); 
const HotelBooking = require('./src/Models/HotelBookingModel'); ;
const aiRoutes = require('./src/Routers/aiRoutes');
// Utils
const sendHotelConfirmation = require('./src/utils/hotelEmail');

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// SECURITY: RATE LIMITERS
// ---------------------------------------------------------
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Too many booking attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { error: "Too many login attempts. Account protected for 1 hour." }
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

// Initialize SQLite
UserModel(); 

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------
app.post('/api/hotels/book', bookingLimiter, async (req, res) => {
    try {
        const booking = new HotelBooking(req.body);
        const savedBooking = await booking.save();
        try {
            await sendHotelConfirmation(savedBooking);
        } catch (emailError) {
            console.error("📧 Email failed:", emailError.message);
        }
        res.status(201).json({ message: "Success", booking: savedBooking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/hotels/my-bookings/:email', async (req, res) => {
    try {
        const bookings = await HotelBooking.find({ passengerEmail: req.params.email }).sort({ bookedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use("/api/ai", aiRoutes);
app.use('/api/users', authLimiter, userRouter); 

// AI ROUTE
app.post('/api/ai/chat', aiController.askAI);

app.get('/', (req, res) => {
    res.status(200).send("TravelGo Production Backend is Online!");
});

app.listen(PORT, () => {
  console.log(`🚀 TravelGo Server running on port ${PORT}`);
});