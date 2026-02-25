import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock, MdSecurity } from 'react-icons/md';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match!");
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully! Check your email for a welcome message.");
                navigate('/login');
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            alert("Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Join TravelGo</h2>
                <p>Start your journey with us today.</p>
                
                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-box">
                        <label><MdEmail /> Email Address</label>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                    
                    <div className="input-box">
                        <label><MdLock /> Create Password</label>
                        <input 
                            type="password" 
                            placeholder="8+ characters" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>

                    <div className="input-box">
                        <label><MdSecurity /> Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="Repeat password" 
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Register Now"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already a member? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;