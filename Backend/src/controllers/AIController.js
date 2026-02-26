const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.askAI = async (req, res) => {
    try {
        console.log("📩 Incoming AI request...");
        const { message } = req.body;

        // 1. Basic Validation
        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY missing in Render environment.");
            return res.status(500).json({ error: "AI API Key not configured on server." });
        }

        // 2. Initialize the SDK
        const genAI = new GoogleGenerativeAI(apiKey);

        // 3. CHANGE: Use "gemini-1.5-flash" instead of "gemini-1.0-pro"
        // gemini-1.5-flash is the most compatible stable model currently.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. Set a system context to make the bot stay "in character"
        const prompt = `You are the TravelGo AI, a helpful travel assistant for the TravelGo flight and hotel booking website. 
        Keep your answers concise and friendly. 
        User Question: ${message}`;

        // 5. Call Google API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ AI Response Successfully Generated");
        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("🔥 GOOGLE AI FETCH ERROR:");
        console.error(error.message);

        // Send a cleaner error back to the user
        res.status(500).json({ 
            error: "The AI is having trouble connecting to Google services.", 
            details: error.message 
        });
    }
};