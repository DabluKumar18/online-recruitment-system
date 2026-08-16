const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Admin details
        const name = "Recruitment Admin";
        const email = "admin@recruitment.com";
        const password = "Admin@123456";

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");
        console.log("Admin ID:", admin._id);
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

        process.exit(0);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();