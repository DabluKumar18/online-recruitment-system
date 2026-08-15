// Mock user accounts — later replace with real auth against the Express/MongoDB backend.
// Demo credentials (shown on the login page too):
//   Applicant -> applicant@example.com / 123456
//   Admin     -> admin@example.com / admin123

export const seedUsers = [
  {
    id: "user-1",
    role: "applicant",
    fullName: "Aarav Mehta",
    email: "applicant@example.com",
    phone: "+91 98765 43210",
    password: "123456",
    location: "Bengaluru, India",
    education: {
      degree: "B.Tech, Computer Science",
      university: "Vellore Institute of Technology",
      graduationYear: "2025",
    },
    experience: "1 year",
    skills: ["React", "JavaScript", "Tailwind CSS", "Node.js"],
    resume: "Aarav_Mehta_Resume.pdf",
  },
  {
    id: "admin-1",
    role: "admin",
    fullName: "Priya Sharma",
    email: "admin@example.com",
    phone: "+91 90000 11122",
    password: "admin123",
    designation: "Talent Acquisition Manager",
  },
];
