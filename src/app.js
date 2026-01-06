const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { useResolvedPath } = require('react-router-dom');

app.use(express.json());

app.post("/signup", async(req, res) =>{
    // cretaing a new instance of the user model
    const user = new User (req.body);
       
    try{
    await user.save();
    res.send("User Added successfully");
    }catch (err) {
        res.status(400).send("Error saving the user:" +err.message);
    }
})

//Get user by email
app.get("/user", async (req, res) =>{
    const userEmail = req.body.emailId;
    try{
        console.log(userEmail);
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        } 
    // const user = await User.find({emailId: userEmail});
    // if(users.length === 0){
    //     res.status(404).send("User went wrong");
    // }else{
    //     res.send(users);
    // }
    
    }catch(err){
      res.status(400).send("something went wrong");
    }
})

//Feed API - get/ feed - get all the users from the database
app.get("/feed", async(req, res) =>{
     try{
        const users = await User.find({});
        res.send(users);
     }catch(err){
        res.status(400).send("Something went wrong");
     }
});

app.delete("/user", async(req, res) =>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
})
// update data user
app.patch("/user", async(req, res) =>{
    const userId = req.body.userId;
    const data = req.body;
    console.log(data);
    try{
        const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument: "after", runValidators: true,});
        console.log(user);
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send("UPDATE FAILED:" +err.message);
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
  


