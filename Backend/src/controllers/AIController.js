const axios = require('axios');

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing" });
        }

        console.log("🚀 Requesting Gemini AI (Standard Pro Model)...");

        // FIX: Changed model to gemini-pro which is the most compatible on the V1 path
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: message }]
            }]
        };

        const response = await axios.post(url, payload);

        // Standard parsing
        const replyText = response.data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error("--- AI SYSTEM ERROR ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Message:", error.response.data.error.message);
            return res.status(error.response.status).json({
                error: "Google AI Error",
                details: error.response.data.error.message
            });
        }
        res.status(500).json({ error: error.message });
    }
};