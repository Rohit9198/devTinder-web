const express = require('express');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require('bcrypt');

app.use(express.json());

app.post("/signup", async(req, res) =>{
    try{
    //validation of data
     validateSignUpData(req);

    const { firstName, lastName, email, password }  = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);
    console.log(passwordHash);

    // cretaing a new instance of the user model
    const user = new User ({
        firstName, lastName, email, password: passwordHash,
    });
       
    await user.save();
    res.send("User Added successfully");
    }catch (err) {
        res.status(400).send("ERROR:" +err.message);
    }
});


app.post("/login", async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("Login Successsfull!!!");
        }else{
            throw new Error("Password not valid");
        }
    }catch(err){
        res.status(400).send("Error:" +err.message);
    }
});




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
app.patch("/user/:userId", async(req, res) =>{
    const userId = req.params?.userId;
    const data = req.body;
    

    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
     if(!isUpdateAllowed){
            throw new Error("updated not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("skills cannot be more than 10");
        }
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
  


