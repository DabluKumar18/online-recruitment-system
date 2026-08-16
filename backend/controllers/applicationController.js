const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply for Job - Applicant Only
const applyForJob = async (req, res) => {
    try {
        const {
            jobId,
            resume,
            coverLetter
        } = req.body;

        // Check required fields
        if (!jobId || !resume || !coverLetter) {
            return res.status(400).json({
                message: "Job ID, resume and cover letter are required"
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check deadline
        if (new Date() > new Date(job.deadline)) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }

        // Check if applicant already applied
        const existingApplication = await Application.findOne({
            applicant: req.user.id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            applicant: req.user.id,
            job: jobId,
            resume,
            coverLetter
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Apply job error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get All Applications - Admin Only
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("applicant", "name email")
            .populate("job", "title company location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Applications fetched successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get applications error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Update Application Status - Admin Only
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        // Check status
        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Find application
        const application = await Application.findById(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Update status
        application.status = status;

        await application.save();

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error(
            "Update application status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get My Applications - Applicant Only
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user.id
        })
            .populate("job", "title company location salary jobType deadline")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your applications fetched successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get my applications error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    applyForJob,
    getAllApplications,
    updateApplicationStatus,
    getMyApplications
};
