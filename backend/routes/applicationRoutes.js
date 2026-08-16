const express = require("express");

const {
    applyForJob,
    getAllApplications,
    updateApplicationStatus,
    getMyApplications
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const applicantOnly = require("../middleware/applicantMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Applicant - Apply for Job
router.post("/", protect, applicantOnly, applyForJob);

// Applicant - Get My Applications
router.get("/my", protect, applicantOnly, getMyApplications);

// Admin - Get All Applications
router.get("/", protect, adminOnly, getAllApplications);

// Admin - Update Application Status
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;