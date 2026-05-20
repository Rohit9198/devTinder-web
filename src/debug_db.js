const mongoose = require("mongoose");
const ConnectionRequest = require("./models/connectionRequest");
const User = require("./models/user");
const connectDB = require("./config/database");

const runDebug = async () => {
    try {
        await connectDB();
        console.log("Connected to DB");

        const users = await User.find({});
        console.log(`Total Users: ${users.length}`);
        // users.forEach(u => console.log(`- ${u._id} : ${u.firstName} ${u.lastName}`));

        const requests = await ConnectionRequest.find({});
        console.log(`Total Connection Requests: ${requests.length}`);

        // Group by status
        const statusCounts = {};
        requests.forEach(r => {
            statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
        });
        console.log("Requests by status:", statusCounts);

        if (requests.length > 0) {
            console.log("First 5 requests:");
            requests.slice(0, 5).forEach(r => console.log(`- ${r.fromUserId} -> ${r.toUserId} [${r.status}]`));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
};

runDebug();
