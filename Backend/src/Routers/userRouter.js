const express = require('express');
const router = express.Router();
const { validateRegistration, verifyToken } = require('../Middleware/middleware');
const { addUser, LoginUser } = require('../controllers/Usercontroller'); 


router.post('/register', validateRegistration, addUser);


router.post('/login', LoginUser);


router.get('/me', verifyToken, (req, res) => {
    res.json({ message: "This is private data", user: req.user });
});

module.exports = router;