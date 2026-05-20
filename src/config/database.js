const mongoose = require('mongoose');

const connectDB = async () => {
     await mongoose.connect("mongodb+srv://rohitsi2252_db_user:iEjvXi5Ji9haBNkd@cluster0.mtvmuwq.mongodb.net/devTinder")

};

module.exports = connectDB;

