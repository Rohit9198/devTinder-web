const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://rohitsi2252_db_user:KrS0oamT3SDZ9PrS@cluster0.mtvmuwq.mongodb.net/devTinder")
};

module.exports = connectDB;


