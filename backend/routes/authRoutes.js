const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    registerUser,
    loginUser,
    getApplicants,
    getApplicantById,
    getMyProfile,
    updateMyProfile
} = require("../controllers/authController");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

// Resume Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    }
});

const upload = multer({
    storage,

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            ".pdf",
            ".doc",
            ".docx"
        ];

        const ext = path
            .extname(file.originalname)
            .toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF, DOC and DOCX files are allowed"
                )
            );
        }
    }
});

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Profile
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You are authorized",
        user: req.user
    });
});

// My Profile
router.get(
    "/me",
    protect,
    getMyProfile
);

// Update My Profile + Resume Upload
router.put(
    "/me",
    protect,
    upload.single("resume"),
    updateMyProfile
);

// Get Applicants - Admin Only
router.get(
    "/applicants",
    protect,
    (req, res, next) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        next();
    },
    getApplicants
);

// Get Applicant By ID - Admin Only
router.get(
    "/applicants/:id",
    protect,
    (req, res, next) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        next();
    },
    getApplicantById
);

module.exports = router;