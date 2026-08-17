const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get All Applicants - Admin Only
const getApplicants = async (req, res) => {
    try {
        const applicants = await User.find(
            { role: "applicant" },
            "-password"
        ).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Applicants fetched successfully",
            count: applicants.length,
            applicants
        });

    } catch (error) {
        console.error("Get applicants error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Applicant By ID - Admin Only
const getApplicantById = async (req, res) => {
    try {
        const applicant = await User.findOne({
            _id: req.params.id,
            role: "applicant"
        }).select("-password");

        if (!applicant) {
            return res.status(404).json({
                message: "Applicant not found"
            });
        }

        res.status(200).json({
            message: "Applicant fetched successfully",
            applicant
        });

    } catch (error) {
        console.error("Get applicant by ID error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Logged-in Applicant Profile
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        console.error("Get my profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update Logged-in Applicant Profile
const updateMyProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            location,
            education,
            experience,
            skills
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;

        // FormData se education string me aata hai
        if (education !== undefined) {
            user.education =
                typeof education === "string"
                    ? JSON.parse(education)
                    : education;
        }

        if (experience !== undefined) {
            user.experience = experience;
        }

        // FormData se skills bhi string me aata hai
        if (skills !== undefined) {
            user.skills =
                typeof skills === "string"
                    ? JSON.parse(skills)
                    : skills;
        }

        // Actual uploaded resume
        if (req.file) {
            user.resume = req.file.filename;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                education: user.education,
                experience: user.experience,
                skills: user.skills,
                resume: user.resume
            }
        });

    } catch (error) {
        console.error("Update profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getApplicants,
    getApplicantById,
    getMyProfile,
    updateMyProfile
};