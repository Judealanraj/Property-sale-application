import mongoose from "mongoose";

const connectDB = async (url) => {
  mongoose.set("strictQuery", true);

  try {
    console.log(
      "Connecting to MongoDB with URL:",
      url.substring(0, 50) + "..."
    );
    await mongoose.connect(url);
    console.log("✓ MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
