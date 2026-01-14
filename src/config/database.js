const mongoose = require('mongoose');

const connectDB = async () =>{
     mongoose.connect("mongodb+srv://rohitsi2252_db_user:dV9onnaRxKAbzall@cluster0.mtvmuwq.mongodb.net/devTinder")
};

module.exports = connectDB;


