const { GoogleGenerativeAI } = require("@google/generative-ai");

// Make sure it reads from the system environment, NOT a hardcoded string
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        // 500 error fix: Ensure model name is correct and key is valid
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are "TravelGo AI", a friendly travel assistant. 
            User Question: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        // Log the actual error to your Render dashboard so you can see it
        console.error("Gemini AI Error:", error.message);
        res.status(500).json({ error: "AI processing failed", details: error.message });
    }
};