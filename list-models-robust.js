const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';

// We can't use the SDK to list models easily without the right import or using the REST API directly for full details
// Let's use the REST API to get the full JSON which is more reliable for seeing supported methods
const https = require('https');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching all available models via REST API...\n');

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.models) {
                const models = parsed.models.map(m => ({
                    name: m.name,
                    version: m.version,
                    displayName: m.displayName,
                    supportedGenerationMethods: m.supportedGenerationMethods
                }));

                // Filter for models that support generateContent
                const chatModels = models.filter(m =>
                    m.supportedGenerationMethods &&
                    m.supportedGenerationMethods.includes('generateContent')
                );

                console.log(`Found ${models.length} total models.`);
                console.log(`Found ${chatModels.length} models supporting generateContent.`);

                console.log('\n--- MODELS SUPPORTING generateContent ---');
                chatModels.forEach(m => {
                    console.log(`\nName: ${m.name}`);
                    console.log(`Display Name: ${m.displayName}`);
                    console.log(`Supported Methods: ${m.supportedGenerationMethods.join(', ')}`);
                });

                fs.writeFileSync('available_models.json', JSON.stringify(chatModels, null, 2));
                console.log('\nSaved detailed list to available_models.json');
            } else {
                console.log('No models found in response:', parsed);
            }
        } catch (e) {
            console.error('Error parsing response:', e);
            console.log('Raw data sample:', data.substring(0, 200));
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
});
