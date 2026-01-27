const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        lowercase: true, 
        required: true,
        unique: true,
        trim: true,
        validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Invalid email address:" +value);
           }
        },
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password:" +value);
            }
        },
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        enum: {
            values:["male", "female", "other"],
            message: '{value} is not a valid gender type'
        },
        // validate(value){
        //     if(!["male", "female", "others"].includes(value)){
        //         throw new Error ("Gender data is not valid");
        //     }
        // },
    },
    photoUrl:{
        type:String,
        default: "https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL:" +value);
            }
        },
    },
    about:{
        type: String,
        default: "This is a default about of the users"
    },
    skills:{
        type:[String],
    },
},
{
    timestamps: true,
}
);

userSchema.index({ firstName:1 });
userSchema.index({ gender:1 });

userSchema.methods.getJWT = async function(){
    const user = this;
const token = await jwt.sign({ _id: userSchema._id}, "DEV@Tinder$790",{
    expiresIn: "7d",
});

return token;

};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser, 
      passwordHash
    );
    return isPasswordValid;
}

module.exports = mongoose.model("user", userSchema);