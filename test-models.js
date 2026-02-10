const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    try {
        console.log(`\nTesting ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Say hello in one sentence');
        const response = await result.response;
        const text = response.text();

        console.log(`✅ SUCCESS with ${modelName}`);
        console.log(`Response: ${text}`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED with ${modelName}`);
        console.log(`Error: ${error.message}`);
        return false;
    }
}

async function main() {
    const modelsToTest = [
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-2.0-flash-lite-001',
        'gemini-2.5-flash-lite-001'
    ];

    console.log('Testing Gemini models...');

    for (const model of modelsToTest) {
        const success = await testModel(model);
        if (success) {
            console.log(`\n🎉 Found working model: ${model}`);
            break;
        }
    }
}

main();
