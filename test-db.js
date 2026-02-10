
const { MongoClient } = require('mongodb');

async function checkConnection() {
    const uri = "mongodb://localhost:27017/fdatabase";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected successfully to server");
    } catch (err) {
        console.error("Connection failed:", err.message);
    } finally {
        await client.close();
    }
}

checkConnection();
