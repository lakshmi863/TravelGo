const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
    try {
        console.log("📩 Incoming AI request...");

        const { message } = req.body;

        // ✅ Validate message
        if (!message || typeof message !== "string" || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required and must be a valid string."
            });
        }

        // ✅ Check API Key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing in environment variables.");
            return res.status(500).json({
                error: "Server configuration error."
            });
        }

        // ✅ Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);

        // 🔥 Use stable supported model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.0-pro"
        });

        // ✅ Generate response
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        console.log("✅ AI Response Success");

        res.status(200).json({
            reply: text
        });

    } catch (error) {
        console.error("🔥 AI CONTROLLER ERROR:");
        console.error(error);

        res.status(500).json({
            error: "TravelGo AI is temporarily unavailable.",
            details: error.message
        });
    }
};