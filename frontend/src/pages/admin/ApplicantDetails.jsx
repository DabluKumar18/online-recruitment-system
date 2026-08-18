import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, FileText } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import { getApplicantById, getApplications, getJobs } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

export default function ApplicantDetails() {
  const { id } = useParams();
  const { showToast } = useApp();
  const [applicant, setApplicant] = useState(undefined);
  const [applications, setApplications] = useState([]);
  const [jobsById, setJobsById] = useState({});

  useEffect(() => {
  async function load() {
    try {
      const [a, allApps, jobs] = await Promise.all([
        getApplicantById(id),
        getApplications(),
        getJobs()
      ]);

      setApplicant(a);

      // Admin ko saare applications milenge,
      // hum sirf current applicant ke applications rakhenge
      const applicantApps = allApps.filter(
        (app) => app.applicantId === id
      );

      setApplications(applicantApps);

      setJobsById(
        Object.fromEntries(
          jobs.map((j) => [j.id, j])
        )
      );
    } catch (error) {
      console.error("Applicant details error:", error);
      showToast(error.message || "Failed to load applicant.", "error");
    }
  }

  load();
}, [id]);

  if (applicant === undefined) return <div className="py-16 text-center text-ink-400">Loading applicant…</div>;
  if (applicant === null) return <div className="py-16 text-center text-ink-400">Applicant not found.</div>;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/applicants" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft size={15} /> Back to Applicants
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-brand-700 text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
            {applicant.fullName.slice(0, 1)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink-900">{applicant.fullName}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-ink-500">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {applicant.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {applicant.phone}</span>
              {applicant.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {applicant.location}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2"><GraduationCap size={17} className="text-brand-600" /> Education</h2>
          <p className="text-sm text-ink-700">{applicant.education?.degree || "—"}</p>
          <p className="text-sm text-ink-500">{applicant.education?.university}</p>
          <p className="text-sm text-ink-500">Graduated {applicant.education?.graduationYear}</p>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-3">Skills & Experience</h2>
          <p className="text-sm text-ink-500 mb-2">Experience: {applicant.experience || "—"}</p>
          <div className="flex flex-wrap gap-1.5">
            {(applicant.skills || []).map((s) => (
              <span key={s} className="text-xs px-2 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-100">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-ink-900 mb-3 flex items-center gap-2"><FileText size={17} className="text-brand-600" /> Resume</h2>
    {applicant.resume ? (
  <a
    href={
      applicant.resume.startsWith("http")
        ? applicant.resume
        : `http://localhost:5000/uploads/${applicant.resume.split("/").pop()}`
    }
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-brand-700 hover:underline font-medium"
  >
    {applicant.resume.split("/").pop()}
  </a>
) : (
  <p className="text-sm text-ink-400">No resume uploaded.</p>
)}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-ink-100">
          <h2 className="font-semibold text-ink-900">Applied Jobs</h2>
        </div>
        {applications.length === 0 ? (
          <p className="p-6 text-sm text-ink-400">This applicant hasn't applied to any jobs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Job</th>
                  <th className="px-5 py-3 font-medium">Applied Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-ink-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-ink-800">{jobsById[app.jobId]?.title || "—"}</td>
                    <td className="px-5 py-3.5 text-ink-500">{formatDate(app.appliedDate)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
