const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        // Initialize inside the function to ensure the key is loaded
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(message);
        const response = await result.response;
        res.status(200).json({ reply: response.text() });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: "AI failed", details: error.message });
    }
};