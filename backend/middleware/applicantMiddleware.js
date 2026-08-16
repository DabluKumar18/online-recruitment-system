const applicantOnly = (req, res, next) => {
    if (req.user && req.user.role === "applicant") {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied. Applicants only."
        });
    }
};

module.exports = applicantOnly;