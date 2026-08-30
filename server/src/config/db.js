import mongoose from "mongoose";
import dns from 'node:dns';

dns.setServers(["1.1.1.1"]);

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected.");
};
