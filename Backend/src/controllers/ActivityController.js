const { Activity, ActivityBooking } = require('../Models/ActivityModel');
const crypto = require('crypto');

// 1. Fetch activities with optional filtering
exports.getActivities = async (req, res) => {
    try {
        const { theme } = req.query;
        // If theme is not 'ALL', filter by theme in MongoDB
        const query = (theme && theme !== 'ALL') ? { theme } : {};
        const activities = await Activity.find(query);
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// 2. Step 1 of Squaring: Create Pending Booking
exports.createActivityOrder = async (req, res) => {
    try {
        const booking = new ActivityBooking({
            ...req.body,
            status: 'PENDING',
            localTransactionId: `ACT_ORD_${crypto.randomBytes(4).toString('hex').toUpperCase()}`
        });
        const saved = await booking.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createActivityEvent = async (req, res) => {
    try {
        console.log("Saving Event Data:", req.body);
        const newEvent = new Activity(req.body);
        await newEvent.save();
        res.status(201).json({ message: "Successfully Created" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// 3. Step 2 of Squaring: Finalize/Confirm
exports.confirmActivityPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const txId = `PAY_ACT_${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        
        const updated = await ActivityBooking.findByIdAndUpdate(
            bookingId,
            { status: 'BOOKED', localTransactionId: txId },
            { new: true }
        );
        res.status(200).json({ message: "Activity Squared!", transaction_id: txId, booking: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

