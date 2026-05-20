const mongoose = require('mongoose');

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://rohitsi2252_db_user:5aKmDzOzLvVZyUYi@cluster0.mtvmuwq.mongodb.net/devTinder");
        console.log("Connected to DB");

        const collection = mongoose.connection.collection('users');
        const users = await collection.find({}).toArray();

        console.log(`Total users: ${users.length}`);

        const emailCounts = {};
        users.forEach(u => {
            const email = u.emailId || "MISSING";
            emailCounts[email] = (emailCounts[email] || 0) + 1;
        });

        const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);

        if (duplicates.length > 0) {
            console.log("Found duplicates:", duplicates);
        } else {
            console.log("No duplicates found by emailId.");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
