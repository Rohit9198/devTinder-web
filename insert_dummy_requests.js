require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/database");
const User = require("./src/models/user");
const ConnectionRequest = require("./src/models/connectionRequest");

const insertDummyRequests = async () => {
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
    console.log(`Total user count: ${users.length}`);

    // Create 50 dummy users if we need more to send requests
    const usersNeeded = 52;
    if (users.length < usersNeeded) {
      console.log(`Creating more dummy users...`);
      const dummyUsers = [];
      for (let i = 0; i < (usersNeeded - users.length); i++) {
        dummyUsers.push({
          firstName: `ReqUser${Date.now()}_${i}`,
          lastName: "Test",
          emailId: `requser${Date.now()}_${i}@example.com`,
          password: "Password@123",
          age: 26,
          gender: "female"
        });
      }
      await User.insertMany(dummyUsers);
      console.log(`Added ${dummyUsers.length} dummy users.`);
      users = await User.find({});
    }

    // Now insert 50 connection requests ("interested") to the first user
    const targetUser = users[0];
    const otherUsers = users.slice(1);
    
    const connectionRequests = [];
    let added = 0;

    for (const other of otherUsers) {
      if (added >= 50) break;
      
      const existingReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: targetUser._id, toUserId: other._id },
          { fromUserId: other._id, toUserId: targetUser._id }
        ]
      });

      if (!existingReq) {
        connectionRequests.push({
          fromUserId: other._id,
          toUserId: targetUser._id,
          status: "interested"
        });
        added++;
        console.log(`Pushed new request from ${other.firstName}`);
      } else {
        // Force it to be an incoming request with 'interested' status
        existingReq.fromUserId = other._id;
        existingReq.toUserId = targetUser._id;
        existingReq.status = "interested";
        await existingReq.save();
        added++;
        console.log(`Updated existing request from ${other.firstName} to be interested`);
      }
    }

    if (connectionRequests.length > 0) {
      await ConnectionRequest.insertMany(connectionRequests);
      console.log(`Successfully added ${connectionRequests.length} dummy pending requests.`);
    } else {
      console.log(`No new requests needed or we reached ${added} requests through existing documents.`);
    }

  } catch (err) {
    console.error("Error inserting dummy requests:", err);
  } finally {
    mongoose.connection.close();
  }
};

insertDummyRequests();
