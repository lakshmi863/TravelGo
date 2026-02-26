import React, { useState, useEffect, useRef } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const initialBotGreeting = 'Hi! I am TravelGo AI. How can I help?';
    
    // States for Position and Dragging
    const [position, setPosition] = useState({ x: null, y: null }); // Coordinates for mobile
    const [isDragging, setIsDragging] = useState(false);
    const [dragStarted, setDragStarted] = useState(false);

    // AI Messages States
    const [displayGreeting, setDisplayGreeting] = useState('');
    const [greetingComplete, setGreetingComplete] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const chatBodyRef = useRef(null);

    // --- DRAG LOGIC FOR MOBILE ONLY ---
    const handleTouchStart = () => {
        setDragStarted(false);
    };

    const handleTouchMove = (e) => {
        setDragStarted(true);
        setIsDragging(true);
        const touch = e.touches[0];
        
        // Calculate new position (minus 30 to center the icon on the finger)
        setPosition({
            x: touch.clientX - 30,
            y: touch.clientY - 30
        });
    };

    const handleTouchEnd = () => {
        // Delay resetting dragging to prevent accidental "clicks" after a move
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleOpenChat = () => {
        // Only open if the user wasn't just dragging the icon around
        if (!isDragging) {
            setIsOpen(true);
        }
    };

    // Initial greeting animation logic
    useEffect(() => {
        let typingInterval;
        if (isOpen) {
            setDisplayGreeting('');
            setGreetingComplete(false);
            setMessages([]); 
            let i = 0;
            typingInterval = setInterval(() => {
                if (initialBotGreeting[i]) {
                    setDisplayGreeting((prev) => prev + initialBotGreeting[i]);
                    i++;
                } else {
                    clearInterval(typingInterval);
                    setGreetingComplete(true);
                    setMessages([{ type: 'bot', text: initialBotGreeting }]);
                }
            }, 50);
        }
        return () => clearInterval(typingInterval);
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { type: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text })
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { type: 'bot', text: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { type: 'bot', text: 'I am offline. Check back later!' }]);
        } finally {
            setLoading(false);
        }
    };

    // Mobile style check
    const mobileStyle = position.x ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto'
    } : {};

    return (
        <>
            {!isOpen && (
                <div 
                    className="bot-container"
                    style={mobileStyle}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={handleOpenChat}
                >
                    {/* Hide tooltip on mobile if it has been moved to keep UI clean */}
                    <span className={`bot-tooltip ${dragStarted ? 'hidden-mobile' : ''}`}>
                        I am TravelGo AI. <br/> How can I help?
                    </span>
                    
                    <div className="floating-bot-btn">
                        <MdSmartToy />
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span><strong>TravelGo</strong> AI</span>
                        <MdClose cursor="pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.length === 0 && !greetingComplete ? (
                            <div className="message bot">{displayGreeting}</div>
                        ) : (
                            messages.map((m, i) => <div key={i} className={`message ${m.type}`}>{m.text}</div>)
                        )}
                        {loading && <div className="message bot">Thinking...</div>}
                    </div>
                    <div className="chat-footer">
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                        <button onClick={handleSend}><MdSend /></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;