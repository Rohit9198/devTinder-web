require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const User = require("./src/models/user");
const ConnectionRequest = require("./src/models/connectionRequest");

const insertDummyData = async () => {
  try {
    try {
      await connectDB();
    } catch (e) {
      console.log("Atlas connectDB failed, trying local MONGO_URI from .env");
      await mongoose.connect(process.env.MONGO_URI);
    }
    console.log("Database connected successfully.");

    // Fetch existing users
    let users = await User.find({});
    console.log(`Initial user count: ${users.length}`);

    // Create 60 dummy users if not enough
    const usersNeeded = 62;
    if (users.length < usersNeeded) {
      console.log(`Creating dummy users...`);
      const dummyUsers = [];
      for (let i = 0; i < (usersNeeded - users.length); i++) {
        dummyUsers.push({
          firstName: `DummyUser${Date.now()}_${i}`,
          lastName: "Test",
          emailId: `dummy${Date.now()}_${i}@example.com`,
          password: "Password@123",
          age: 25,
          gender: "male"
        });
      }
      await User.insertMany(dummyUsers);
      console.log(`Added ${dummyUsers.length} dummy users.`);
      users = await User.find({});
    }

    // Now insert 60 connection requests
    // Let's pick the first user as the target user
    const targetUser = users[0];
    const otherUsers = users.slice(1);

    const statuses = ["ignored", "interested", "accepted", "rejected"];
    
    const connectionRequests = [];
    
    // First, clear existing connections for targetUser to avoid duplicates maybe?
    // User might want purely additive, let's just make sure we don't insert duplicate by catching errors.

    let added = 0;
    for (const other of otherUsers) {
      if (added >= 60) break;
      
      const existingReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: targetUser._id, toUserId: other._id },
          { fromUserId: other._id, toUserId: targetUser._id }
        ]
      });

      if (!existingReq) {
        // Randomly decide direction and status
        const isTargetSender = Math.random() > 0.5;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        connectionRequests.push({
          fromUserId: isTargetSender ? targetUser._id : other._id,
          toUserId: isTargetSender ? other._id : targetUser._id,
          status: status
        });
        added++;
      }
    }

    if (connectionRequests.length > 0) {
      await ConnectionRequest.insertMany(connectionRequests);
      console.log(`Successfully added ${connectionRequests.length} dummy connection requests.`);
    } else {
      console.log("No new connections needed or all possible connections already exist.");
    }

  } catch (err) {
    console.error("Error inserting dummy data:", err);
  } finally {
    mongoose.connection.close();
  }
};

insertDummyData();
