import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log("⚠️  Server will continue without MongoDB. Some features may not work.");
    // Don't exit - allow server to run without DB for chatbot
  }
};

export default connectDB;
