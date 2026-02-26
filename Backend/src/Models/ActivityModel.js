const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    city: { type: String, required: true },
    // Removed image field
    theme: { type: String, enum: ['ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'], required: true },
    price: { type: Number, required: true }, 
    duration: String,
    description: String
});

const activityBookingSchema = new mongoose.Schema({
    activityName: String,
    userName: String,
    userEmail: String,
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' },
    localTransactionId: String, 
    amountPaid: Number
});

const Activity = mongoose.model('Activity', activitySchema);
const ActivityBooking = mongoose.model('ActivityBooking', activityBookingSchema);

module.exports = { Activity, ActivityBooking };