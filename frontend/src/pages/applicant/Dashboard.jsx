import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Hourglass, ListChecks, Award, ArrowRight } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import JobCard from "../../components/JobCard";
import EmptyState from "../../components/EmptyState";
import { getApplications, getJobs } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

export default function ApplicantDashboard() {
  const { currentUser } = useApp();
  const [applications, setApplications] = useState([]);
  const [jobsById, setJobsById] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [apps, allJobs] = await Promise.all([getApplications({ applicantId: currentUser.id }), getJobs()]);
      setApplications(apps);
      const map = {};
      allJobs.forEach((j) => (map[j.id] = j));
      setJobsById(map);
      setRecommended(allJobs.slice(0, 3));
      setLoading(false);
    }
    load();
  }, [currentUser.id]);

  const stats = {
    submitted: applications.length,
    underReview: applications.filter((a) => a.status === "Under Review").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    selected: applications.filter((a) => a.status === "Selected").length,
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-ink-900">Welcome back, {currentUser.fullName.split(" ")[0]}!</h1>
      <p className="text-ink-500 text-sm mt-1">Here's an overview of your job search.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        <StatCard label="Applications Submitted" value={stats.submitted} icon={FileText} accent="brand" />
        <StatCard label="Under Review" value={stats.underReview} icon={Hourglass} accent="amber" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={ListChecks} accent="blue" />
        <StatCard label="Selected" value={stats.selected} icon={Award} accent="purple" />
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <h2 className="font-semibold text-ink-900">Recent Applications</h2>
          <Link to="/applicant/applications" className="text-sm text-brand-700 font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-ink-400 text-sm">Loading…</div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Start applying to jobs to see them tracked here."
            action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Job</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Applied Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => {
                  const job = jobsById[app.jobId];
                  return (
                    <tr key={app.id} className="border-b border-ink-50 last:border-0">
                      <td className="px-5 py-3.5 font-medium text-ink-800">{job?.title || "—"}</td>
                      <td className="px-5 py-3.5 text-ink-500">{job?.company || "—"}</td>
                      <td className="px-5 py-3.5 text-ink-500">{formatDate(app.appliedDate)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                      <td className="px-5 py-3.5">
                        {job && <Link to={`/jobs/${job.id}`} className="text-brand-700 font-medium hover:underline">View Job</Link>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-semibold text-ink-900 mb-4">Recommended Jobs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommended.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
