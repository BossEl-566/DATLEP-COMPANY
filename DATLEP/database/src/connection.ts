import mongoose from "mongoose";

let isConnected = false;

export const connectDatabase = async (mongoUri: string) => {
  if (isConnected) return;

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};
