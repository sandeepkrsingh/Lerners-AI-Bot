
const mongoose = require('mongoose');

// Attempting to connect with URL encoded password
// Original: mongodb+srv://bond:<Bond@123>@cluster0.8c42sum.mongodb.net/?appName=Cluster0
// Assumption: Password is 'Bond@123', brackets were a placeholder wrapper.
const password = encodeURIComponent('Bond@123');
const uri = `mongodb+srv://bond:${password}@cluster0.8c42sum.mongodb.net/learner-autobot?retryWrites=true&w=majority&appName=Cluster0`;

console.log("Testing connection to:", uri.replace(password, '****'));

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("FAILURE: Could not connect.");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
