import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Toast from "./components/Toast";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ApplicantDashboard from "./pages/applicant/Dashboard";
import ApplicantApplications from "./pages/applicant/Applications";
import ApplicantProfile from "./pages/applicant/Profile";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminJobs from "./pages/admin/Jobs";
import CreateJob from "./pages/admin/CreateJob";
import EditJob from "./pages/admin/EditJob";
import AdminApplications from "./pages/admin/Applications";
import AdminApplicants from "./pages/admin/Applicants";
import ApplicantDetails from "./pages/admin/ApplicantDetails";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <AppProvider>
      <Toast />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant (protected) */}
          <Route
            path="/applicant/dashboard"
            element={<ProtectedRoute role="applicant"><ApplicantDashboard /></ProtectedRoute>}
          />
          <Route
            path="/applicant/applications"
            element={<ProtectedRoute role="applicant"><ApplicantApplications /></ProtectedRoute>}
          />
          <Route
            path="/applicant/profile"
            element={<ProtectedRoute role="applicant"><ApplicantProfile /></ProtectedRoute>}
          />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin (protected) */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<CreateJob />} />
          <Route path="/admin/jobs/:id/edit" element={<EditJob />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/applicants" element={<AdminApplicants />} />
          <Route path="/admin/applicants/:id" element={<ApplicantDetails />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-5xl font-bold text-ink-900 mb-3">404</h1>
      <p className="text-ink-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Back to Home</a>
    </div>
  );
}
