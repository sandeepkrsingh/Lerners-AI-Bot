const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro'
    ];

    for (const modelName of modelsToTest) {
        try {
            console.log(`\nTesting model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent('Hello');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ ${modelName} works!`);
            console.log('Response:', text.substring(0, 50) + '...');
            break; // Exit on first success
        } catch (error) {
            console.error(`❌ ${modelName} failed:`, error.message);
        }
    }
}

testGemini();
