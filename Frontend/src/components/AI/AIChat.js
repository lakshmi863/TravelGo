import React, { useState, useEffect, useRef } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    // The full greeting text we want to animate
    const initialBotGreeting = 'Hi! I am TravelGo AI. How can I help?';
    
    // State to control the typing animation effect for the first message
    const [displayGreeting, setDisplayGreeting] = useState('');
    const [greetingComplete, setGreetingComplete] = useState(false);

    // This array will hold user and bot messages after the initial greeting is complete
    const [messages, setMessages] = useState([]); 
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const chatBodyRef = useRef(null); // Reference for automatic scrolling

    // Effect for the initial typing animation and resetting chat state
    useEffect(() => {
        let typingInterval;

        if (isOpen) {
            // When chat opens, reset animation and messages
            setDisplayGreeting('');
            setGreetingComplete(false);
            setMessages([]); 
            setInput(''); // Also clear the input when opening

            let i = 0;
            typingInterval = setInterval(() => {
                setDisplayGreeting((prev) => prev + initialBotGreeting[i]);
                i++;
                if (i === initialBotGreeting.length) {
                    clearInterval(typingInterval);
                    setGreetingComplete(true);
                    // Add the complete greeting as the first official message once typing is done
                    setMessages([{ type: 'bot', text: initialBotGreeting }]);
                }
            }, 50); // Adjust typing speed here (milliseconds per character)
        } else {
            // Cleanup on close
            clearInterval(typingInterval); // Clear any ongoing interval
            setDisplayGreeting('');
            setGreetingComplete(false);
            setMessages([]);
            setInput('');
        }
        return () => clearInterval(typingInterval); // Cleanup interval on component unmount
    }, [isOpen]); // Depend on 'isOpen' to re-trigger the animation or reset

    // Effect for auto-scrolling to the bottom of the chat window
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, displayGreeting, loading]); // Scroll when messages/typing/loading updates

    const handleSend = async () => {
        if (!input.trim()) return; // Prevent sending empty messages

        // If the greeting animation is still playing, force it to complete
        if (!greetingComplete) {
            clearInterval(); // Stop the typing animation immediately
            setDisplayGreeting(initialBotGreeting); // Set full text
            setGreetingComplete(true); // Mark as complete
            setMessages([{ type: 'bot', text: initialBotGreeting }]); // Add to messages
            // Allow state to update before proceeding if needed, though typically fast enough
        }
        
        const userMessage = { type: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user's message to display
        setInput(''); // Clear input field
        setLoading(true); // Show typing indicator

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text }) // Send the user's actual message
            });
            const data = await res.json();
            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: data.reply }]);
        } catch (err) {
            console.error("Failed to fetch AI response:", err);
            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: 'I am temporarily offline. Please try again soon.' }]);
        } finally {
            setLoading(false); // Hide typing indicator
        }
    };

    return (
        <>
            {/* Floating button to open the chat */}
            <div className="floating-bot-btn" onClick={() => setIsOpen(true)}>
                <MdSmartToy />
            </div>

            {/* Chat window, only rendered when isOpen is true */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span><strong>TravelGo</strong> AI Support</span>
                        <MdClose cursor="pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="chat-body" ref={chatBodyRef}>
                        {/* Conditional rendering for the initial animated greeting */}
                        {messages.length === 0 && !greetingComplete && displayGreeting ? (
                            // Show partial animated greeting
                            <div className="message bot">{displayGreeting}</div>
                        ) : (
                            // Show all accumulated messages
                            messages.map((m, i) => (
                                <div key={i} className={`message ${m.type}`}>{m.text}</div>
                            ))
                        )}
                        {/* Typing indicator */}
                        {loading && <div className="message bot">AI is typing...</div>}
                    </div>
                    <div className="chat-footer">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask me anything about TravelGo!" // Updated placeholder for clarity
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading} // Disable input while AI is thinking
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