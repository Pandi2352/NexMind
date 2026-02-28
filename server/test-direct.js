const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/ailearning');
        const ap = await mongoose.connection.db.collection('aiproviders').findOne({aiProviderName: 'gemini'});
        if (!ap) {
            console.error("No gemini provider found");
            process.exit(1);
        }
        
        const apiKey = ap.apiKey.trim();
        console.log(`Key: [${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}] (Length: ${apiKey.length})`);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        
        console.log("Embedding 'test content' directly with @google/generative-ai...");
        const result = await model.embedContent("test content");
        
        if (result && result.embedding) {
            console.log("Embedding Result:", JSON.stringify(result.embedding.values.slice(0, 5)));
            console.log("Length:", result.embedding.values.length);
        } else {
            console.log("Result is null or missing embedding!");
        }
        
        process.exit(0);
    } catch (e) {
        console.error("Direct Error:", e.name, e.message);
        if (e.status) console.log("Status:", e.status);
        process.exit(1);
    }
}

run();
