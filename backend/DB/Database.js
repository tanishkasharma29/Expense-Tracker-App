import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const connectDB = async () => {
  try {
    const db = process.env.MONGO_URL;
    if (!db) {
      throw new Error("MONGO_URL is not defined in environment variables.");
    }

    const { connection } = await mongoose.connect(db);

    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
