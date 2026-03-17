require("dotenv").config();
const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

if(!mongoURL){
    console.error("MONGO URL is not defined, check your .env file.");
    process.exit(1);
}

const connectDB = async () => {
    try{
        await mongoose.connect(mongoURL, {
            serverSelectionTimeoutMS: 5000, // stop trying after 5 seconds
        });
        console.log("Conntected to mongodb successfully.");
    } catch(err) {
        console.log("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

//event listener
mongoose.connection.on("disconnected", () => {
    console.log("Mongodb disconnected. Try to connect again...");
    connectDB();
});

mongoose.connection.on("error", err => {
    console.error("MongoDB connection error:", err);
});

//shutdown handling
process.on("SIGINT", async() => {
    await mongoose.connection.close();
    console.log("MongoDB Connection closed. Exiting....");
    process.exit();
});

module.exports = connectDB;