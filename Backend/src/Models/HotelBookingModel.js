const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
    hotelName: String,
    city: String,
    passengerName: String, // Added
    passengerEmail: String,
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number,
    address: String,
    status: { type: String, default: 'CONFIRMED' }, // Added for cancellation
    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);