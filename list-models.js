const https = require('https');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

console.log('Fetching all available models...\n');

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.models) {
                console.log('Available Gemini models:');
                parsed.models.forEach(model => {
                    const modelName = model.name.replace('models/', '');
                    console.log(`  - ${modelName}`);
                });
            }
        } catch (e) {
            console.log('Error:', e.message);
        }
    });
}).on('error', (err) => {
    console.error('Request failed:', err.message);
});
