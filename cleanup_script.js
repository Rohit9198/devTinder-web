const mongoose = require('mongoose');

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://rohitsi2252_db_user:5aKmDzOzLvVZyUYi@cluster0.mtvmuwq.mongodb.net/devTinder");
        console.log("Connected to DB");

        const collection = mongoose.connection.collection('users');

        // 1. Delete users with missing emailId
        const deleteMissing = await collection.deleteMany({ emailId: { $exists: false } });
        console.log(`Deleted ${deleteMissing.deletedCount} users with missing emailId.`);

        // 2. Handle duplicates
        const users = await collection.find({ emailId: { $exists: true } }).sort({ createdAt: -1 }).toArray();
        const seen = new Set();
        const toDelete = [];

        for (const user of users) {
            // emailId might be null if it exists but is null, though schema says required string.
            // If manual insertion happened, who knows.
            if (!user.emailId) {
                toDelete.push(user._id);
                continue;
            }

            if (seen.has(user.emailId)) {
                toDelete.push(user._id);
            } else {
                seen.add(user.emailId);
            }
        }

        if (toDelete.length > 0) {
            const deleteDuplicates = await collection.deleteMany({ _id: { $in: toDelete } });
            console.log(`Deleted ${deleteDuplicates.deletedCount} duplicate users (kept latest).`);
        } else {
            console.log("No duplicates found to delete.");
        }

        // 3. Create Index
        // We use createIndex to force creation
        await collection.createIndex({ emailId: 1 }, { unique: true });
        console.log("Successfully created unique index on emailId.");

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
