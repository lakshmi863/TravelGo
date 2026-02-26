import React, { useState } from 'react';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I am TravelGo AI. Ask me about flights, places, or the weather!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { type: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://travelgo-v7ha.onrender.com/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            setMessages([...newMessages, { type: 'bot', text: data.reply }]);
        } catch (err) {
            setMessages([...newMessages, { type: 'bot', text: 'I am temporarily offline. Please try again soon.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="floating-bot-btn" onClick={() => setIsOpen(true)}>
                <MdSmartToy />
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span><strong>TravelGo</strong> AI Support</span>
                        <MdClose cursor="pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <div className="chat-body">
                        {messages.map((m, i) => (
                            <div key={i} className={`message ${m.type}`}>{m.text}</div>
                        ))}
                        {loading && <div className="message bot">AI is typing...</div>}
                    </div>
                    <div className="chat-footer">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Type a message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}><MdSend /></button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChat;