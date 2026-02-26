const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const aiController = require('./src/controllers/AIController');

// Config and Models
const userRouter = require('./src/Routers/userRouter'); 
const db = require('./src/Config/db'); // SQLite Config
const UserModel = require('./src/Models/UserModel'); // SQLite User Table Init
const HotelBooking = require('./src/Models/HotelBookingModel'); // MongoDB Hotel Model
const activityRouter = require('./src/Routers/activityRouter');

// Utils
const sendHotelConfirmation = require('./src/utils/hotelEmail');

const app = express();
// Priority: Render dynamic port -> or 5000 for local
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------
// SECURITY: RATE LIMITERS (Protects your system from spam)
// ---------------------------------------------------------

// A. Hotel Booking Limiter (Limits IP to 5 bookings per 15 min)
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Too many booking attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// B. Auth Limiter (Prevents password guessing)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { error: "Too many login attempts. Account protected for 1 hour." }
});

// ---------------------------------------------------------
// MIDDLEWARE (Squared for Production)
// ---------------------------------------------------------
app.use(helmet()); // Adds security headers to prevent hacker injections
app.use(cors({
    origin: ["http://localhost:3000", "https://travelgo-front.onrender.com"],
    credentials: true
}));
app.use(express.json()); // Parses incoming JSON data

// 1. Initialize SQLite Database Table (For Identity Auth)
UserModel(); 

// 2. Connect to MongoDB Atlas (Production Cloud)
// FIX: REMOVED < > BRACKETS FROM PASSWORD
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vblakshmipathi:sHBMYQjHcQHpxxvm@cluster0.noej51i.mongodb.net/travelgo?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (Hospitality DB)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// ---------------------------------------------------------
// HOTEL BOOKING API ROUTES
// ---------------------------------------------------------

/**
 * @route   POST /api/hotels/book
 * @desc    Save a hotel booking to Atlas and send confirmation
 */
app.post('/api/hotels/book', bookingLimiter, async (req, res) => {
    try {
        console.log("🏨 Saving Booking Data to Atlas:", req.body);
        
        const booking = new HotelBooking(req.body);
        const savedBooking = await booking.save();
        
        // Branded Email Notification (Squared Async)
        try {
            await sendHotelConfirmation(savedBooking);
        } catch (emailError) {
            console.error("📧 SMTP Warning (Record saved, email failed):", emailError.message);
        }

        res.status(201).json({ 
            message: "Success", 
            booking: savedBooking 
        });
    } catch (error) {
        console.error("❌ Booking Storage Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/hotels/my-bookings/:email
 * @desc    Identity filtering for private dashboard
 */
app.get('/api/hotels/my-bookings/:email', async (req, res) => {
    try {
        const email = req.params.email;
        // Filters directly by current user's email
        const bookings = await HotelBooking.find({ passengerEmail: email }).sort({ bookedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// GLOBAL API ROUTES
// ---------------------------------------------------------
app.use('/api/activities', activityRouter);

// Apply authLimiter specifically to the users route to stop hackers
app.use('/api/users', authLimiter, userRouter); 
app.post('/api/ai/chat', aiController.askAI);
// ---------------------------------------------------------
// SERVER INITIALIZATION
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).send("TravelGo Production Backend is Online!");
});

app.listen(PORT, () => {
  console.log(`🚀 TravelGo Server Squared & running on port ${PORT}`);
});