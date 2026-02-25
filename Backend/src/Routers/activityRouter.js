const express = require('express');
const router = express.Router();
const { 
    getActivities, 
    createActivityOrder, 
    confirmActivityPayment,
    createActivityEvent // New Controller Function
} = require('../controllers/ActivityController');

// 1. GET activities (supports filtering by theme e.g. /api/activities?theme=WATER)
router.get('/', getActivities);

// 2. CREATE a new activity (Adventure, Water, Food etc. - Saved to MongoDB)
router.post('/create-event', createActivityEvent);

// 3. BOOK an activity (Initiates PENDING status)
router.post('/book', createActivityOrder);

// 4. CONFIRM booking (Logic Squaring - Status to BOOKED)
router.patch('/confirm/:bookingId', confirmActivityPayment);

module.exports = router;