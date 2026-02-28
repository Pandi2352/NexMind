const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const mongoose = require("mongoose");

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ailearning');
        const ap = await mongoose.connection.db.collection('aiproviders').findOne({aiProviderName: 'gemini'});
        if (!ap) {
            console.error("No gemini provider found");
            process.exit(1);
        }
        
        const apiKey = ap.apiKey;
        const chat = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            modelName: "gemini-1.5-flash",
        });
        
        console.log("Testing Chat with Gemini...");
        const res = await chat.invoke("Say hello");
        console.log("Chat Response:", res.content);
        
        process.exit(0);
    } catch (e) {
        console.error("Chat test failed:", e.message);
        process.exit(1);
    }
}

run();
