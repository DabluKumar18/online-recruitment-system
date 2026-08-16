const express = require("express");
const {
    registerUser,
    loginUser
} = require("../controllers/authController");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

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

module.exports = router;