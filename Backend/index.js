const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
 // 1. Added Rate Limit Import

// Config and Models
const userRouter = require('./src/Routers/userRouter'); 
const db = require('./src/Config/db'); // SQLite Config
const UserModel = require('./src/Models/UserModel'); // SQLite User Table Init
const HotelBooking = require('./src/Models/HotelBookingModel'); // MongoDB Hotel Model
const activityRouter = require('./src/Routers/activityRouter');
// Utils
const sendHotelConfirmation = require('./src/utils/hotelEmail');

const app = express();
const PORT = 5000;

// ---------------------------------------------------------
// SECURITY: RATE LIMITERS
// ---------------------------------------------------------

// A. Limiter for Hotel Bookings (Preventing email/DB spam)
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 bookings per window
    message: { error: "Too many booking attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

// B. Limiter for Auth (Preventing hackers from guessing passwords)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 10, // Limit each IP to 10 login/register attempts per hour
    message: { error: "Too many login attempts. Account protected for 1 hour." }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// 1. Initialize SQLite Database Table (For Auth)
UserModel(); 

// 2. Connect to MongoDB (For Hotel Bookings)
mongoose.connect('mongodb://localhost:27017/travelgo')
  .then(() => console.log('✅ MongoDB Connected (Hotels DB)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ---------------------------------------------------------
// HOTEL BOOKING API ROUTES
// ---------------------------------------------------------

/**
 * @route   POST /api/hotels/book
 * @desc    Save a new hotel booking with rate limiting applied
 */
app.post('/api/hotels/book', bookingLimiter, async (req, res) => { // 2. Applied limiter here
    try {
        console.log("🏨 Receiving Booking Data:", req.body);
        
        const booking = new HotelBooking(req.body);
        const savedBooking = await booking.save();
        
        // Trigger Email Notification (Asynchronous)
        try {
            await sendHotelConfirmation(savedBooking);
        } catch (emailError) {
            console.error("📧 Nodemailer Error (Booking saved, but email failed):", emailError.message);
        }

        res.status(201).json({ 
            message: "Success", 
            booking: savedBooking 
        });
    } catch (error) {
        console.error("❌ Route Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /api/hotels/my-bookings/:email
 * @desc    Fetch all hotel bookings for a specific user to show in "My Bookings"
 */
app.get('/api/hotels/my-bookings/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const bookings = await HotelBooking.find({ passengerEmail: email }).sort({ bookedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ---------------------------------------------------------
// USER AUTH API ROUTES
// ---------------------------------------------------------
app.use('/api/activities', activityRouter);

// Apply authLimiter to the entire users router to prevent password attacks
app.use('/api/users', authLimiter, userRouter); 

// ---------------------------------------------------------
// HEALTH CHECK & SERVER INIT
// ---------------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).send("TravelGo Node.js Backend API is running with Security Protections!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});