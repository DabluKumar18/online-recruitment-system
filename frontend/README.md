# HireHub — Online Recruitment System (Frontend)

A complete, professional frontend for an online recruitment platform, built with React and Tailwind CSS. This is the **frontend-only** portion of a college team project — it currently runs on mock data and browser `localStorage`, and is structured so a teammate's Node.js/Express/MongoDB backend can be plugged in later with minimal changes.

## Features

### Applicant
- Register and login (mock authentication)
- Browse, search, and filter jobs (keyword, location, job type, experience, work mode, category)
- View full job details
- Apply to jobs with a validated application form (resume file selection, cover letter, etc.)
- Duplicate-application prevention
- Track submitted applications with a visual status tracker (Applied → Under Review → Shortlisted → Interview → Selected)
- Save/bookmark jobs
- Edit profile (personal info, education, skills, resume)

### Admin
- Secure admin login (separate from applicant login)
- Dashboard with hiring statistics and a simple CSS-based chart
- Create, edit, and delete job postings
- View and filter all applications (by job, status, applicant name)
- Update an applicant's status — reflected instantly on the applicant's side
- Browse all applicants and view full applicant profiles + application history
- Analytics page with jobs-by-category and applications-by-status breakdowns
- Settings page (profile, password, notification preferences)

### General
- Fully responsive (desktop, tablet, mobile)
- Toast notifications for key actions
- Form validation with clear error messages
- Empty states for no-results scenarios
- Data persists across page refreshes via `localStorage`

## Tech Stack

- **React 19** + **Vite** — app framework and dev/build tooling
- **Tailwind CSS** — styling
- **React Router v7** — routing
- **Axios** (installed, ready to use once the backend is live)
- **Lucide React** — icons
- Plain JavaScript (`.jsx`), no TypeScript

No Redux, Zustand, GraphQL, Firebase, or UI component libraries are used — only `useState`, `useEffect`, and `useContext` for state management.

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

To build for production:

```bash
npm run build
npm run preview
```

## Demo Credentials

**Applicant**
- Email: `applicant@example.com`
- Password: `123456`

**Admin** (login at `/admin/login`)
- Email: `admin@example.com`
- Password: `admin123`

You can also register a new applicant account from the Register page.

## Folder Structure

```
src/
├── components/       # Reusable UI components (Navbar, JobCard, Modal, forms, etc.)
├── pages/
│   ├── applicant/     # Applicant dashboard, applications, profile
│   ├── admin/         # Admin dashboard, job/application/applicant management
│   └── *.jsx          # Public pages: Home, Jobs, JobDetails, Login, Register, About
├── context/
│   └── AppContext.jsx # Auth state, current user, toast notifications
├── services/
│   └── api.js         # All data operations — swap this file's internals for axios calls later
├── data/               # Mock seed data (jobs, applicants, applications, users)
├── utils/
│   └── helpers.js      # Formatting, validation, and misc helper functions
├── App.jsx             # Route definitions
└── main.jsx             # App entry point
```

## Connecting the Backend

All data access goes through `src/services/api.js`. Every exported function (`getJobs`, `getJobById`, `createJob`, `submitApplication`, `loginUser`, etc.) currently reads and writes `localStorage`. No component talks to `localStorage` or the mock data files directly.

To connect the real Node.js/Express/MongoDB backend:

1. Create a `.env` file (see `.env.example`) and set `VITE_API_BASE_URL` to your backend's URL, e.g. `http://localhost:5000/api`.
2. In `src/services/api.js`, replace the body of each function with an `axios` call. For example:

   ```js
   // Before (mock)
   export async function getJobs(filters = {}) {
     await delay();
     const all = readStore(KEYS.jobs, seedJobs);
     // ...filtering logic
     return result;
   }

   // After (real backend)
   import axios from "axios";
   export async function getJobs(filters = {}) {
     const { data } = await axios.get(`${API_BASE_URL}/jobs`, { params: filters });
     return data;
   }
   ```

3. Do the same for authentication (`loginUser`, `registerApplicant`) once the backend issues real sessions/tokens, and for file uploads (`submitApplication`'s resume field) once the backend supports multipart uploads.
4. No page or component should need to change — they only ever call functions from `services/api.js`.

## Notes

- This is a student project frontend built for demonstration purposes. Passwords and auth are handled in plain `localStorage` for the mock/demo only — this is **not** secure and must be replaced by real backend authentication before any production use.
- Do not commit a `.env` file — only `.env.example` is tracked.
