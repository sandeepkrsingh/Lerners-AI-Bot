const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini2() {
    try {
        console.log('Testing gemini-2.0-flash model...\n');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent('Hello! Please respond with a friendly greeting.');
        const response = await result.response;
        const text = response.text();

        console.log('✅ SUCCESS! Gemini 2.0 Flash is working!');
        console.log('\nResponse:', text);
    } catch (error) {
        console.log('❌ FAILED');
        console.log('Error message:', error.message);
    }
}

testGemini2();
