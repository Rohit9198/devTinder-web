const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require('bcrypt');

authRouter.post("/signup", async(req, res) =>{
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

authRouter.post("/login", async (req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successsfull!!!");
        }else{
            throw new Error("Password not valid");
        }
    }catch(err){
        res.status(400).send("Error:" +err.message);
    }
});

authRouter.post("/logout", async(req, res) =>{

    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send(" Logout successful!!! ");
})

module.exports = authRouter;