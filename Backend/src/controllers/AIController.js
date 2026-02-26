const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Get the key exactly when the request happens
        const key = process.env.GEMINI_API_KEY;

        if (!key) {
            console.error("AI Error: GEMINI_API_KEY is missing from process.env");
            return res.status(500).json({ error: "Server Configuration Error: No API Key found." });
        }

        // 2. Initialize inside the function
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Simple generate call
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        console.log("AI Response Success");
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("--- REAL AI ERROR ---");
        console.error(error.message);
        
        res.status(500).json({ 
            error: "TravelGo AI is sleeping. Try again later.",
            details: error.message 
        });
    }
};