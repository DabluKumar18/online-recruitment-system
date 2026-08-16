const Job = require("../models/Job");

// Create Job - Admin Only
const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            requirements,
            salary,
            jobType,
            deadline
        } = req.body;

        // Check required fields
        if (
            !title ||
            !company ||
            !location ||
            !description ||
            !requirements ||
            !salary ||
            !jobType ||
            !deadline
        ) {
            return res.status(400).json({
                message: "All job fields are required"
            });
        }

        // Create job
        const job = await Job.create({
            title,
            company,
            location,
            description,
            requirements,
            salary,
            jobType,
            deadline,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Jobs fetched successfully",
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get jobs error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get Single Job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job fetched successfully",
            job
        });

    } catch (error) {
        console.error("Get job error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Update Job - Admin Only
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("createdBy", "name email");

        res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.error("Update job error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Delete Job - Admin Only
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
};