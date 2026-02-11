// Script to create admin user: bond0007@gmail.com
// Run this with: node scripts/createAdmin.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    firebaseUid: String,
    role: String,
    permissions: {
        manageUsers: Boolean,
        manageCorpus: Boolean,
        manageDB: Boolean,
        viewChats: Boolean,
    },
    isActive: Boolean,
    createdAt: Date,
});

async function createAdminUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'bond0007@gmail.com' });

        if (existingUser) {
            console.log('User already exists. Updating to admin...');

            // Hash the password
            const hashedPassword = await bcrypt.hash('Bond@123', 10);

            existingUser.password = hashedPassword;
            existingUser.role = 'admin';
            existingUser.permissions = {
                manageUsers: true,
                manageCorpus: true,
                manageDB: true,
                viewChats: true,
            };
            existingUser.isActive = true;

            await existingUser.save();
            console.log('✅ User updated to admin successfully!');
        } else {
            console.log('Creating new admin user...');

            // Hash the password
            const hashedPassword = await bcrypt.hash('Bond@123', 10);

            const adminUser = new User({
                name: 'Bond Admin',
                email: 'bond0007@gmail.com',
                password: hashedPassword,
                role: 'admin',
                permissions: {
                    manageUsers: true,
                    manageCorpus: true,
                    manageDB: true,
                    viewChats: true,
                },
                isActive: true,
                createdAt: new Date(),
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log('\nAdmin User Details:');
        console.log('Email: bond0007@gmail.com');
        console.log('Password: Bond@123');
        console.log('Role: admin');
        console.log('Permissions: All granted');

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');

    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
