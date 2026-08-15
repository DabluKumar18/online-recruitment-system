// Mock application records — later replace with GET ${API_URL}/applications from the backend.
// statusFlow encodes the order used for the visual progress indicator.

export const statusFlow = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected"];

export const applications = [
  { id: "appl-1", applicantId: "user-1", jobId: "job-1", appliedDate: "2026-08-01", lastUpdated: "2026-08-05", status: "Shortlisted" },
  { id: "appl-2", applicantId: "user-1", jobId: "job-5", appliedDate: "2026-08-03", lastUpdated: "2026-08-03", status: "Applied" },
  { id: "appl-3", applicantId: "user-1", jobId: "job-9", appliedDate: "2026-07-29", lastUpdated: "2026-08-06", status: "Interview" },
  { id: "appl-4", applicantId: "app-2", jobId: "job-4", appliedDate: "2026-08-06", lastUpdated: "2026-08-07", status: "Under Review" },
  { id: "appl-5", applicantId: "app-2", jobId: "job-11", appliedDate: "2026-08-11", lastUpdated: "2026-08-11", status: "Applied" },
  { id: "appl-6", applicantId: "app-3", jobId: "job-3", appliedDate: "2026-07-22", lastUpdated: "2026-08-04", status: "Selected" },
  { id: "appl-7", applicantId: "app-3", jobId: "job-12", appliedDate: "2026-08-03", lastUpdated: "2026-08-08", status: "Interview" },
  { id: "appl-8", applicantId: "app-4", jobId: "job-5", appliedDate: "2026-07-16", lastUpdated: "2026-07-20", status: "Rejected" },
  { id: "appl-9", applicantId: "app-4", jobId: "job-9", appliedDate: "2026-08-10", lastUpdated: "2026-08-10", status: "Applied" },
  { id: "appl-10", applicantId: "app-5", jobId: "job-6", appliedDate: "2026-08-04", lastUpdated: "2026-08-09", status: "Shortlisted" },
  { id: "appl-11", applicantId: "app-6", jobId: "job-7", appliedDate: "2026-08-09", lastUpdated: "2026-08-09", status: "Applied" },
  { id: "appl-12", applicantId: "app-7", jobId: "job-2", appliedDate: "2026-08-02", lastUpdated: "2026-08-07", status: "Interview" },
  { id: "appl-13", applicantId: "app-7", jobId: "job-8", appliedDate: "2026-07-26", lastUpdated: "2026-08-01", status: "Shortlisted" },
  { id: "appl-14", applicantId: "app-9", jobId: "job-10", appliedDate: "2026-08-01", lastUpdated: "2026-08-06", status: "Under Review" },
  { id: "appl-15", applicantId: "app-10", jobId: "job-11", appliedDate: "2026-08-12", lastUpdated: "2026-08-12", status: "Applied" },
];
