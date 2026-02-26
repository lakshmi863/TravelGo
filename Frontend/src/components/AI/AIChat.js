import React, { useState, useEffect, useRef } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // POSITIONING LOGIC
    // Set a default state. If null, CSS handles it.
    const [position, setPosition] = useState({ x: null, y: null });
    const [isMoving, setIsMoving] = useState(false);

    const chatBodyRef = useRef(null);

    // Logic for mobile touch dragging
    const handleTouchMove = (e) => {
        // Prevent background scrolling while dragging
        e.persist();
        const touch = e.touches[0];
        
        // Offset so finger is in the center of the 60px icon
        const newX = touch.clientX - 30; 
        const newY = touch.clientY - 30;

        setIsMoving(true);
        setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
        // Delay to distinguish between a "drag" and a "click"
        setTimeout(() => setIsMoving(false), 100);
    };

    const openChat = () => {
        // If the user was just moving the icon, don't open the chat
        if (!isMoving) {
            setIsOpen(true);
        }
    };

    // Auto-scroll chat
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Handle Gemini API logic
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { type: 'bot', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { type: 'bot', text: 'Service currently offline.' }]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Inline Style
    const getMobileStyle = () => {
        if (position.x === null) return {}; // Let CSS take over on Desktop
        
        return {
            left: `${position.x}px`,
            top: `${position.y}px`,
            right: 'auto',   // Force ignore original CSS
            bottom: 'auto',  // Force ignore original CSS
            position: 'fixed'
        };
    };

    return (
        <>
            {!isOpen && (
                <div 
                    className="bot-container" 
                    style={getMobileStyle()}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={openChat}
                >
                    <span className="bot-tooltip">I am TravelGo AI.<br/>How can I help?</span>
                    <div className="floating-bot-btn">
                        <MdSmartToy />
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>TravelGo Support</span>
                        <MdClose onClick={() => setIsOpen(false)} cursor="pointer" />
                    </div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.length === 0 && <div className="message bot">Hi! How can I help you today?</div>}
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.type}`}>{m.text}</div>
                        ))}
                        {loading && <div className="message bot">Typing...</div>}
                    </div>
                    <div className="chat-footer">
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." />
                        <button onClick={handleSend}><MdSend /></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;