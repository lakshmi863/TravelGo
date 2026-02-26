const { GoogleGenerativeAI } = require("@google/generative-ai");

// Fetch key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;

        // Validation: Ensure message exists
        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        // Initialize Model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are "TravelGo AI", a friendly travel assistant for the TravelGo website. 
            User Question: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        // This log will now appear in your RENDER DASHBOARD logs
        console.error("--- REAL AI ERROR ---");
        console.error(error.message); 
        
        res.status(500).json({ 
            error: "TravelGo AI Error", 
            details: error.message // Sending details helps you debug in the browser console
        });
    }
};