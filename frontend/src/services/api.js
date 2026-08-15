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
  await delay();
  const all = readStore(KEYS.jobs, seedJobs);
  let result = [...all];

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(
      (j) => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw) || j.skills?.some((s) => s.toLowerCase().includes(kw))
    );
  }
  if (filters.location) {
    const loc = filters.location.toLowerCase();
    result = result.filter((j) => j.location.toLowerCase().includes(loc));
  }
  if (filters.type) result = result.filter((j) => j.type === filters.type);
  if (filters.experience) result = result.filter((j) => j.experience === filters.experience);
  if (filters.workMode) result = result.filter((j) => j.workMode === filters.workMode);
  if (filters.category) result = result.filter((j) => j.category === filters.category);

  return result;
}

export async function getJobById(id) {
  await delay();
  const all = readStore(KEYS.jobs, seedJobs);
  return all.find((j) => j.id === id) || null;
}

export async function createJob(job) {
  await delay();
  const all = readStore(KEYS.jobs, seedJobs);
  const newJob = {
    ...job,
    id: generateId("job"),
    postedDate: new Date().toISOString().slice(0, 10),
    status: job.status || "Active",
  };
  const updated = [newJob, ...all];
  writeStore(KEYS.jobs, updated);
  return newJob;
}

export async function updateJob(id, updates) {
  await delay();
  const all = readStore(KEYS.jobs, seedJobs);
  const updated = all.map((j) => (j.id === id ? { ...j, ...updates } : j));
  writeStore(KEYS.jobs, updated);
  return updated.find((j) => j.id === id);
}

export async function deleteJob(id) {
  await delay();
  const all = readStore(KEYS.jobs, seedJobs);
  const updated = all.filter((j) => j.id !== id);
  writeStore(KEYS.jobs, updated);
  return true;
}

// --- Saved jobs (applicant "Save Job" feature) ------------------------------

export async function getSavedJobs(userId) {
  await delay(100);
  const all = readStore(KEYS.savedJobs, {});
  return all[userId] || [];
}

export async function toggleSavedJob(userId, jobId) {
  await delay(100);
  const all = readStore(KEYS.savedJobs, {});
  const list = all[userId] || [];
  const next = list.includes(jobId) ? list.filter((id) => id !== jobId) : [...list, jobId];
  writeStore(KEYS.savedJobs, { ...all, [userId]: next });
  return next;
}

// ---------------------------------------------------------------------------
// APPLICATIONS
// ---------------------------------------------------------------------------

export async function getApplications(filters = {}) {
  await delay();
  const all = readStore(KEYS.applications, seedApplications);
  let result = [...all];
  if (filters.applicantId) result = result.filter((a) => a.applicantId === filters.applicantId);
  if (filters.jobId) result = result.filter((a) => a.jobId === filters.jobId);
  if (filters.status) result = result.filter((a) => a.status === filters.status);
  return result;
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
  await delay(400);
  const all = readStore(KEYS.applications, seedApplications);

  const alreadyApplied = all.some((a) => a.applicantId === application.applicantId && a.jobId === application.jobId);
  if (alreadyApplied) {
    throw new Error("You have already applied to this job.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const newApplication = {
    ...application,
    id: generateId("appl"),
    appliedDate: today,
    lastUpdated: today,
    status: "Applied",
  };
  const updated = [newApplication, ...all];
  writeStore(KEYS.applications, updated);
  return newApplication;
}

export async function updateApplicationStatus(id, status) {
  await delay();
  const all = readStore(KEYS.applications, seedApplications);
  const updated = all.map((a) => (a.id === id ? { ...a, status, lastUpdated: new Date().toISOString().slice(0, 10) } : a));
  writeStore(KEYS.applications, updated);
  return updated.find((a) => a.id === id);
}

// ---------------------------------------------------------------------------
// APPLICANTS
// ---------------------------------------------------------------------------

export async function getApplicants() {
  await delay();
  return readStore(KEYS.applicants, seedApplicants);
}

export async function getApplicantById(id) {
  await delay();
  const all = readStore(KEYS.applicants, seedApplicants);
  return all.find((a) => a.id === id) || null;
}

export async function updateApplicantProfile(id, updates) {
  await delay();
  const all = readStore(KEYS.applicants, seedApplicants);
  const exists = all.some((a) => a.id === id);
  const updated = exists ? all.map((a) => (a.id === id ? { ...a, ...updates } : a)) : [...all, { id, ...updates }];
  writeStore(KEYS.applicants, updated);
  return updated.find((a) => a.id === id);
}

// ---------------------------------------------------------------------------
// AUTH (mock — replace with real JWT/session auth against the backend)
// ---------------------------------------------------------------------------

export async function loginUser(email, password) {
  await delay(400);
  const users = readStore(KEYS.users, seedUsers);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  const { password: _pw, ...safeUser } = user;
  writeStore(KEYS.currentUser, safeUser);
  return safeUser;
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
