const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');


// Manually read .env.local to avoid adding 'dotenv' dependency
const envPath = path.resolve(__dirname, '.env.local');
let apiKey = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    const match = envConfig.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
}

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('Key found:', apiKey.substring(0, 10) + '...');

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
});

async function testOpenRouter() {
    try {
        console.log('Testing OpenRouter connection with google/gemini-2.0-flash-001...');
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello!" }
            ],
        });

        console.log('✅ Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testOpenRouter();
