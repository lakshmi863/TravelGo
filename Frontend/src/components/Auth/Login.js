import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://travelgo-v7ha.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and email to identify the user
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);
                alert("Welcome back to TravelGo!");
                navigate('/');
                window.location.reload(); // Refresh to update Navbar state
            } else {
                alert(data.message || "Invalid Credentials");
            }
        } catch (error) {
            alert("Connection error. Is the Backend running on port 5000?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to manage your bookings and explore deals.</p>
                
                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="input-box">
                        <label><MdEmail /> Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="input-box">
                        <label><MdLock /> Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>

                <div className="auth-footer">
                    New to TravelGo? <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;