const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testSystemInstructionChatFixed() {
    try {
        console.log('Testing gemini-2.0-flash with FIXED systemInstruction...\n');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const chat = model.startChat({
            history: [],
            systemInstruction: {
                role: 'system',
                parts: [{ text: "You are a helpful assistant." }]
            }
        });

        const result = await chat.sendMessage('Hello');
        const response = await result.response;
        console.log('✅ SUCCESS!');
        console.log('Response:', response.text());
    } catch (error) {
        console.log('❌ FAILED');
        console.log('Error message:', error.message);
    }
}

testSystemInstructionChatFixed();
