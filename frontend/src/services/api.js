// ---------------------------------------------------------------------------
// API SERVICE LAYER
// ---------------------------------------------------------------------------
// Every function in this file currently reads/writes localStorage + mock data.
// When the Node.js/Express/MongoDB backend is ready, swap the body of each
// function for an axios call using API_BASE_URL below. Because every page
// and component only calls functions from this file (never localStorage or
// mock data directly), the rest of the app will not need to change.
//
// Example of what a "real" version will look like:
//
//   export async function getJobs(filters) {
//     const { data } = await axios.get(`${API_BASE_URL}/jobs`, { params: filters });
//     return data;
//   }
//
// ---------------------------------------------------------------------------

import { jobs as seedJobs } from "../data/jobs";
import { applications as seedApplications } from "../data/applications";
import { applicants as seedApplicants } from "../data/applicants";
import { seedUsers } from "../data/users";
import { generateId } from "../utils/helpers";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// A small artificial delay so loading states feel real during the demo.
const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

// --- localStorage helpers ---------------------------------------------------

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

const KEYS = {
  jobs: "jobs",
  applications: "applications",
  applicants: "applicants",
  users: "users",
  currentUser: "currentUser",
  savedJobs: "savedJobs",
};

// ---------------------------------------------------------------------------
// JOBS
// ---------------------------------------------------------------------------

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();

  if (filters.keyword) {
    params.append("keyword", filters.keyword);
  }

  if (filters.location) {
    params.append("location", filters.location);
  }

  const query = params.toString();

  const response = await fetch(
    `${API_BASE_URL}/jobs${query ? `?${query}` : ""}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data.jobs.map((job) => ({
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    skills: job.requirements || [],
    requirements: job.requirements || [],
    salary: job.salary,
    type: job.jobType,
    jobType: job.jobType || job.type,
    deadline: job.deadline,
    experience: "",
    workMode: "",
    category: "",
    postedDate: job.createdAt,
  }));
}

export async function getSavedJobs(userId) {
  const saved = JSON.parse(localStorage.getItem("savedJobs") || "{}");
  return saved[userId] || [];
}

export async function toggleSavedJob(userId, jobId) {
  const saved = JSON.parse(localStorage.getItem("savedJobs") || "{}");
  const current = saved[userId] || [];

  const updated = current.includes(jobId)
    ? current.filter((id) => id !== jobId)
    : [...current, jobId];

  localStorage.setItem(
    "savedJobs",
    JSON.stringify({
      ...saved,
      [userId]: updated,
    })
  );

  return updated;
}

export async function getJobById(id) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`);

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(data.message || "Failed to fetch job");
  }

  const job = data.job;

  return {
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    skills: job.requirements || [],
    requirements: job.requirements || [],
    salary: job.salary,
    type: job.jobType,
    jobType: job.jobType,
    deadline: job.deadline,
    postedDate: job.createdAt,

    // Backend mein abhi ye fields nahi hain
    experience: "Not specified",
    workMode: "Not specified",
    openings: 1,
    responsibilities: [],
    qualifications: [],
    benefits: [],
    about: "",
  };
}

export async function createJob(job) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      requirements: job.skills || job.requirements || [],
      salary: job.salary,
      jobType: job.jobType || job.type,
      deadline: job.deadline,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create job");
  }

  const createdJob = data.job;

  return {
    id: createdJob._id,
    title: createdJob.title,
    company: createdJob.company,
    location: createdJob.location,
    description: createdJob.description,
    skills: createdJob.requirements || [],
    requirements: createdJob.requirements || [],
    salary: createdJob.salary,
    type: createdJob.jobType,
    jobType: createdJob.jobType,
    deadline: createdJob.deadline,
    experience: "",
    workMode: "",
    category: "",
    postedDate: createdJob.createdAt,
  };
}

export async function updateJob(id, updates) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: updates.title,
      company: updates.company,
      location: updates.location,
      description: updates.description,
      requirements: updates.skills || updates.requirements || [],
      salary: updates.salary,
      jobType: updates.type || updates.jobType,
      deadline: updates.deadline,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update job");
  }

  const job = data.job;

  return {
    id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    skills: job.requirements || [],
    requirements: job.requirements || [],
    salary: job.salary,
    type: job.jobType,
    jobType: job.jobType,
    deadline: job.deadline,
    postedDate: job.createdAt,

    experience: "Not specified",
    workMode: "Not specified",
    openings: 1,
    responsibilities: [],
    qualifications: [],
    benefits: [],
    about: "",
  };
}

export async function deleteJob(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(
    `${API_BASE_URL}/jobs/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete job"
    );
  }

  return data;
}

// ---------------------------------------------------------------------------
// APPLICATIONS
// ---------------------------------------------------------------------------

export async function getApplications(filters = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to view applications.");
  }

  const endpoint = filters.applicantId
    ? `${API_BASE_URL}/applications/my`
    : `${API_BASE_URL}/applications`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applications");
  }

  return data.applications.map((application) => ({
    id: application._id,

    applicantId: application.applicant
      ? typeof application.applicant === "object"
        ? application.applicant._id
        : application.applicant
      : null,

    jobId: application.job
      ? typeof application.job === "object"
        ? application.job._id
        : application.job
      : null,

    resume: application.resume,
    coverLetter: application.coverLetter,
    status: application.status,
    appliedDate: application.createdAt,
    lastUpdated: application.updatedAt,
  }));
}

export async function getAdminApplications() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applications");
  }

  return data.applications;
}

export async function getApplicationById(id) {
  await delay();
  const all = readStore(KEYS.applications, seedApplications);
  return all.find((a) => a.id === id) || null;
}

export async function hasApplied(applicantId, jobId) {
  const all = readStore(KEYS.applications, seedApplications);
  return all.some((a) => a.applicantId === applicantId && a.jobId === jobId);
}

export async function submitApplication(application) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login to apply for a job.");
  }

  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jobId: application.jobId,
      resume: application.resume,
      coverLetter: application.coverLetter,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit application");
  }

  return data.application;
}

export async function updateApplicationStatus(id, status) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(
    `${API_BASE_URL}/applications/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update application status"
    );
  }

  return data.application;
}

// ---------------------------------------------------------------------------
// APPLICANTS
// ---------------------------------------------------------------------------

export async function getApplicants() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/applicants`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applicants");
  }

  return data.applicants.map((applicant) => ({
    id: applicant._id,
    fullName: applicant.name,
    email: applicant.email,
    phone: applicant.phone || "",
    skills: applicant.skills || [],
    experience: applicant.experience || "",
    resume: applicant.resume || "",
  }));
}

export async function getApplicantById(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as admin.");
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/applicants/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      data.message || "Failed to fetch applicant"
    );
  }

  const applicant = data.applicant;

  return {
    id: applicant._id,
    fullName: applicant.name,
    email: applicant.email,
    phone: applicant.phone || "",
    location: applicant.location || "",
    education: applicant.education || {
      degree: "",
      university: "",
      graduationYear: ""
    },
    experience: applicant.experience || "",
    skills: applicant.skills || [],
    resume: applicant.resume || ""
  };
}

export async function getMyProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch profile"
    );
  }

  const user = data.user;

  return {
    id: user.id || user._id,
    fullName: user.name,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    education: user.education || {
      degree: "",
      university: "",
      graduationYear: "",
    },
    experience: user.experience || "",
    skills: user.skills || [],
    resume: user.resume || "",
  };
}

export async function updateApplicantProfile(id, updates, resumeFile) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const formData = new FormData();

  formData.append("name", updates.fullName);
  formData.append("phone", updates.phone);
  formData.append("location", updates.location);
  formData.append(
    "education",
    JSON.stringify(updates.education)
  );
  formData.append("experience", updates.experience);
  formData.append(
    "skills",
    JSON.stringify(updates.skills)
  );

  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update profile"
    );
  }

  const user = data.user;

  return {
    id: user.id || user._id,
    fullName: user.name,
    email: user.email,
    phone: user.phone || "",
    location: user.location || "",
    education: user.education || {
      degree: "",
      university: "",
      graduationYear: "",
    },
    experience: user.experience || "",
    skills: user.skills || [],
    resume: user.resume || "",
  };
}

// ---------------------------------------------------------------------------
// AUTH (mock — replace with real JWT/session auth against the backend)
// ---------------------------------------------------------------------------

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  const user = {
    ...data.user,
    fullName: data.user.name,
  };

  localStorage.setItem("token", data.token);
  writeStore(KEYS.currentUser, user);

  return user;
}

export async function registerApplicant({ fullName, email, phone, password }) {
  await delay(400);
  const users = readStore(KEYS.users, seedUsers);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const newUser = { id: generateId("user"), role: "applicant", fullName, email, phone, password };
  writeStore(KEYS.users, [...users, newUser]);

  const applicants = readStore(KEYS.applicants, seedApplicants);
  writeStore(KEYS.applicants, [
    ...applicants,
    { id: newUser.id, fullName, email, phone, location: "", education: { degree: "", university: "", graduationYear: "" }, experience: "", skills: [], resume: "" },
  ]);

  const { password: _pw, ...safeUser } = newUser;
  writeStore(KEYS.currentUser, safeUser);
  return safeUser;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(KEYS.currentUser);
}
