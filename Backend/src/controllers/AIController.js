const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Check if Key exists in environment
        if (!process.env.GEMINI_API_KEY) {
            console.error("ERROR: GEMINI_API_KEY is missing from environment variables!");
            return res.status(500).json({ error: "AI Configuration Missing" });
        }

        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        // 2. Initialize
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are "TravelGo AI", a friendly travel assistant for the TravelGo website. User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("--- AI CONTROLLER ERROR ---");
        console.error(error); // Log full error object
        
        res.status(500).json({ 
            error: "TravelGo AI is currently unavailable", 
            details: error.message 
        });
    }
};