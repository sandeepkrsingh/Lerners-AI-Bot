const https = require('https');

const apiKey = 'AIzaSyB4ql9Nl_T1CvRT2K3gRuJhx1S-XxOK3OA';
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

console.log('Testing API key validity...\n');

https.get(url, (res) => {
    let data = '';

    console.log('Status Code:', res.statusCode);
    console.log('Status Message:', res.statusMessage);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log('\n✅ API Key is VALID!');
                console.log('\nAvailable models:');
                if (parsed.models) {
                    parsed.models.slice(0, 5).forEach(model => {
                        console.log(`  - ${model.name}`);
                    });
                }
            } else {
                console.log('\n❌ API Key is INVALID or has issues');
                console.log('Error:', parsed);
            }
        } catch (e) {
            console.log('\n❌ Error parsing response');
            console.log('Raw response:', data);
        }
    });
}).on('error', (err) => {
    console.error('❌ Request failed:', err.message);
});
