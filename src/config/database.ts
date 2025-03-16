import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDatabase = async () => {
  try {
    
    if (!process.env.MONGO_URI) {
      throw new Error('No MongoDb URI provided');
    }

    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/events");
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDatabase;
