const mongoose = require('mongoose');
const User = require('./src/models/user');

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://rohitsi2252_db_user:5aKmDzOzLvVZyUYi@cluster0.mtvmuwq.mongodb.net/devTinder");
        console.log("Connected to DB");

        const testUser = new User({
            firstName: "Test",
            lastName: "User",
            emailId: `test${Date.now()}@example.com`, // Unique email to avoid collision conflicts unless schema is wrong
            password: "StrongPassword@123",
            age: 25,
            gender: "male"
        });

        console.log("Attempting to save user:", testUser);
        await testUser.save();
        console.log("User saved successfully!");

    } catch (err) {
        console.error("Signup Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
