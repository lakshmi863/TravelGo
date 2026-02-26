const { GoogleGenerativeAI } = require("@google/generative-ai");

// USE process.env to make it work on Render
const apiKey = process.env.GEMINI_API_KEY;

// Check if Key exists at startup to prevent crashing
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing from environment variables!");
}

const genAI = new GoogleGenerativeAI(apiKey);

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Ensure you have selected a valid model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are "TravelGo AI", a friendly travel assistant... User Question: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        // Log the EXACT error to your Render 'Logs' tab so you can see why it failed
        console.error("AI SQUARING ERROR:", error.message);
        
        res.status(500).json({ 
            error: "TravelGo AI Error", 
            message: error.message 
        });
    }
};