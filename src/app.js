const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async(req, res) =>{
    // cretaing a new instance of the user model
    const user = new User ({
        firstName: "Rahul",
        lastName: "Singh",
        emailId: "rahulsi123@gmail.com",
        password: "rahul@123",
        
    });
    try{
    await user.save();
    res.send("User Added successfully");
    }catch (err) {
        res.status(400).send("Error saving the user:" +err.message);
    }
})

connectDB()
.then(() =>{
    console.log("Database conection established...");
    app.listen(7777, () =>{
        console.log("server is successfully listening on port 7777...");
    });
})
.catch((err) =>{
    console.log("Database cannot be connected!!!");
});
  


