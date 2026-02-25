const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: String,
    city: String,
    theme: { type: String, enum: ['ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'] },
    price:{ type: Number, required: true }, 
    duration: String,
    image: String,
    description: String
});

const activityBookingSchema = new mongoose.Schema({
    activityName: String,
    userName: String,
    userEmail: String,
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, default: 'PENDING' },
    localTransactionId: String, // For Squaring
    amountPaid: Number
});

const Activity = mongoose.model('Activity', activitySchema);
const ActivityBooking = mongoose.model('ActivityBooking', activityBookingSchema);

module.exports = { Activity, ActivityBooking };