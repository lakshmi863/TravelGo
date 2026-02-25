const db = require('../Config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendWelcomeEmail = require('../utils/sendEmail');

const addUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const checkEmailQuery = `SELECT email FROM users WHERE email = ?`;

        db.get(checkEmailQuery, [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (row) {
                return res.status(409).json({ message: "Email already registered" });
            }

  
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userinsert = `INSERT INTO users(email, password) VALUES(?, ?);`;

            db.run(userinsert, [email, hashedPassword], (err) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                 sendWelcomeEmail(email); 
                return res.status(201).json({ message: "user created successfully" });
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        }

        const getUserQuery = `SELECT * FROM users WHERE email = ?`;

        db.get(getUserQuery, [email], async (err, row) => {
            if (err) return res.status(500).json({ message: err.message });
            
            // Fix 1: Check if user exists
            if (!row) {
                return res.status(404).json({ message: "User not found" });
            }

            // Fix 2: Compare passwords inside the callback
            const ispasswordValid = await bcrypt.compare(password, row.password);
            if (!ispasswordValid) {
                return res.status(401).json({ message: "invalid credentials" });
            }

            // Fix 3: Use a consistent secret key (ensure this matches middleware)
            const token = jwt.sign(
                { id: row.id, email: row.email }, 
                'mysecretkey', 
                { expiresIn: '1h' }
            );

            return res.status(200).json({ token });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }               
}
module.exports = { addUser, LoginUser };