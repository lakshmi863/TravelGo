const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    city: { type: String, required: true },
    theme: { 
        type: String, 
        required: true,
        enum: ['ADVENTURE', 'WATER', 'SIGHTSEEING', 'FOOD'] // Matches your filter names
    },
    price: { type: Number, required: true }, 
    duration: { type: String, required: true },
    description: { type: String, required: true }
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