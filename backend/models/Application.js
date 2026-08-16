const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        resume: {
            type: String,
            required: true
        },

        coverLetter: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Shortlisted", "Rejected", "Selected"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", applicationSchema);