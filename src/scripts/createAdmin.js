const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@sushodhpublisher.com";

    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log("Admin already exists:", adminExists.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await User.create({
      email,
      password: "admin123",
      role: "admin",
    });

    console.log("Admin created successfully:", admin.email);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
