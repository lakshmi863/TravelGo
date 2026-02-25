const jwt = require('jsonwebtoken'); // Add this line at the top
const SECRET = 'mysecretkey';

const validateRegistration = (req, res, next) => {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (!email || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "invalid email format" });
    }
    
    // Fix: Send a single string message or an array
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            message: "Password must be 8+ chars, include one uppercase, one number, and one special character"
        });
    }
    next();
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Fix: Handle Bearer Token format
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = jwt.verify(token, 'mysecretkey');
        req.user = decoded;
        next(); // Move to next ONLY if verification succeeds
    } catch (err) {
        return res.status(400).json({ message: "Invalid token." });
    }
    
}

module.exports = { validateRegistration, verifyToken };