const express = require("express");

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Create Job - Admin Only
router.post("/", protect, adminOnly, createJob);

// Get All Jobs
router.get("/", getAllJobs);

// Get Single Job - Public
router.get("/:id", getJobById);

// Update Job - Admin Only
router.put("/:id", protect, adminOnly, updateJob);

// Delete Job - Admin Only
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;