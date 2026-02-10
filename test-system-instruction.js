const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testSystemInstruction() {
    try {
        console.log('Testing gemini-2.0-flash with systemInstruction...\n');
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: "You are a helpful assistant."
        });

        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log('✅ SUCCESS!');
        console.log('Response:', response.text());
    } catch (error) {
        console.log('❌ FAILED');
        console.log('Error message:', error.message);
    }
}

testSystemInstruction();
