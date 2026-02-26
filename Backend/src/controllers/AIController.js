const axios = require('axios');

exports.askAI = async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;

        if (!apiKey) {
            return res.status(500).json({ error: "API Key missing" });
        }

        // --- DIAGNOSTIC STEP: FIND OUT WHAT MODELS YOU ACTUALLY HAVE ---
        console.log("🔍 Checking available models for your API Key...");
        const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const listResponse = await axios.get(listModelsUrl);
        
        // This will print a list in your console. Look for names like "models/gemini-..."
        const availableModels = listResponse.data.models.map(m => m.name);
        console.log("✅ Models available to you:", availableModels);

        // We will try to find a model you are actually allowed to use
        // Prefer 1.5-flash, then pro, then the first one in your list
        let modelToUse = "";
        if (availableModels.includes("models/gemini-1.5-flash")) modelToUse = "gemini-1.5-flash";
        else if (availableModels.includes("models/gemini-pro")) modelToUse = "gemini-pro";
        else modelToUse = availableModels[0].replace("models/", ""); // Use whatever you have

        console.log(`🚀 Using assigned model: ${modelToUse}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: message }] }]
        };

        const response = await axios.post(url, payload);
        const replyText = response.data.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply: replyText });

    } catch (error) {
        console.error("--- AI SYSTEM ERROR ---");
        if (error.response) {
            console.error("Data:", JSON.stringify(error.response.data));
            return res.status(error.response.status).json({
                error: "Google AI Error",
                message: error.response.data.error.message
            });
        }
        res.status(500).json({ error: error.message });
    }
};