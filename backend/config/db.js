import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Ne pas faire process.exit(1) pour permettre aux tests de gérer l'erreur
    throw error; // Lance l'erreur au lieu de tuer le processus
  }
};

export default connectDB;
