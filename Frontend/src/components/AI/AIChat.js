import React, { useState, useEffect, useRef } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const initialBotGreeting = 'Hi! I am TravelGo AI. How can I help?';
    
    const [displayGreeting, setDisplayGreeting] = useState('');
    const [greetingComplete, setGreetingComplete] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const chatBodyRef = useRef(null);

    useEffect(() => {
        let typingInterval;
        if (isOpen) {
            setDisplayGreeting('');
            setGreetingComplete(false);
            setMessages([]); 
            setInput('');
            let i = 0;
            typingInterval = setInterval(() => {
                if (initialBotGreeting[i]) {
                    setDisplayGreeting((prev) => prev + initialBotGreeting[i]);
                }
                i++;
                if (i >= initialBotGreeting.length) {
                    clearInterval(typingInterval);
                    setGreetingComplete(true);
                    setMessages([{ type: 'bot', text: initialBotGreeting }]);
                }
            }, 50);
        }
        return () => clearInterval(typingInterval);
    }, [isOpen]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, displayGreeting, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMessage = { type: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text })
            });
            const data = await res.json();
            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: data.reply }]);
        } catch (err) {
            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: 'I am temporarily offline. Please try again soon.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* UPDATED: Hover Tooltip Container */}
            {!isOpen && (
                <div className="bot-container">
                    <span className="bot-tooltip">
                        I am TravelGo AI. <br/> How can I help?
                    </span>
                    <div className="floating-bot-btn" onClick={() => setIsOpen(true)}>
                        <MdSmartToy />
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span><strong>TravelGo</strong> AI Support</span>
                        <MdClose cursor="pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.length === 0 && !greetingComplete ? (
                            <div className="message bot">{displayGreeting}</div>
                        ) : (
                            messages.map((m, i) => (
                                <div key={i} className={`message ${m.type}`}>{m.text}</div>
                            ))
                        )}
                        {loading && <div className="message bot">AI is typing...</div>}
                    </div>
                    <div className="chat-footer">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask about places or weather..." 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                        />
                        <button onClick={handleSend} disabled={loading}>
                            <MdSend />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;