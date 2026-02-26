const { GoogleGenerativeAI } = require("@google/generative-ai");

// You can get a free API key from https://aistudio.google.com/
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Setting a System Prompt to keep the AI in "Travel Agent" mode
        const prompt = `
            You are "TravelGo AI", a friendly travel assistant for the TravelGo website. 
            Your goal is to help users find places, explain flight/hotel booking steps, 
            and talk about potential travel offers. 
            Current Date: ${new Date().toLocaleDateString()}
            
            User Question: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "TravelGo AI is sleeping. Try later!" });
    }
};

