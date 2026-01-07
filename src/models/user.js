const mongoose = require('mongoose');
const validator = require('validator');

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
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error ("Gender data is not valid");
            }
        },
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

module.exports = mongoose.model("User", userSchema);