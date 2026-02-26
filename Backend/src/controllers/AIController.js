const axios = require('axios');

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing" });
        }

        // --- THE "BRAIN" OF TRAVELGO ---
        // This context is prepended to every user query so the AI knows its identity.
        const systemContext = `
        You are "TravelGo AI", the specialized digital assistant for the TravelGo travel platform.
        
        Information about this application:
        - It is a Full-Stack application built using the MERN Stack (MongoDB, Express, React, Node.js) and Django.
        - Primary Features:
            1. Flight Search & Booking: Integrated with an interactive airplane seat map for seat selection.
            2. Hotel Management: Users can search and book premium hotels by city.
            3. Digital Boarding Passes: Available in the 'My Bookings' section.
            4. In-Flight Services: Users can order specific meals (Veg Maharaja, Classic Chicken) after booking.
            5. Local Activities: Themes include ADVENTURE, WATER, SIGHTSEEING, and FOOD.
        
        Response Rules:
        - Be enthusiastic, professional, and concise.
        - Always refer to the user's travel journey in the context of TravelGo.
        - If a user asks "Who created you?", say you were built by the TravelGo Development Team.
        - If asked about booking, guide them to the specific navigation links (Flights, Hotels, Activities).
        
        Context ends here.
        User Question: ${message}`;

        // Using the model we confirmed works locally
        const model = "gemini-1.5-flash"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: systemContext }] // We send the context + user question together
            }]
        };

        const response = await axios.post(url, payload);
        const replyText = response.data.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error("--- AI ERROR ---");
        res.status(500).json({ error: "TravelGo AI failed to respond." });
    }
};