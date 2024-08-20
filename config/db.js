const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

mongoose.set("strictQuery", true);

const connectDb = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://sushantgadyal19:12345@cluster0.hpmd1.mongodb.net/Motorq_DB?retryWrites=true&w=majority&appName=Cluster0");
        console.log("DB connected");
    }
    catch(err){
        console.log("Error while connecting DB ", err);
    }
}

module.exports = connectDb;