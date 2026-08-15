import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, CheckCircle2, FileText, ListChecks, Users2, Award, ArrowRight } from "lucide-react";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import SimpleBarChart from "../../components/SimpleBarChart";
import { getJobs, getApplications, getApplicantById } from "../../services/api";
import { formatDate } from "../../utils/helpers";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allJobs, allApps] = await Promise.all([getJobs(), getApplications()]);
      setJobs(allJobs);
      setApplications(allApps);

      const sorted = [...allApps].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 6);
      const withNames = await Promise.all(
        sorted.map(async (a) => {
          const applicant = await getApplicantById(a.applicantId);
          const job = allJobs.find((j) => j.id === a.jobId);
          return { ...a, applicantName: applicant?.fullName || "—", jobTitle: job?.title || "—" };
        })
      );
      setRecent(withNames);
      setLoading(false);
    }
    load();
  }, []);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "Active").length,
    totalApplications: applications.length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    selected: applications.filter((a) => a.status === "Selected").length,
  };

  const chartData = [
    { label: "Applied", value: applications.filter((a) => a.status === "Applied").length },
    { label: "Review", value: applications.filter((a) => a.status === "Under Review").length },
    { label: "Shortlisted", value: stats.shortlisted },
    { label: "Interview", value: stats.interviews },
    { label: "Selected", value: stats.selected },
    { label: "Rejected", value: applications.filter((a) => a.status === "Rejected").length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Admin Dashboard</h1>
      <p className="text-ink-500 text-sm mt-1">Overview of jobs, applications, and hiring progress.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-7">
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={Briefcase} accent="brand" />
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={CheckCircle2} accent="blue" />
        <StatCard label="Total Applications" value={stats.totalApplications} icon={FileText} accent="ink" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={ListChecks} accent="amber" />
        <StatCard label="Interviews" value={stats.interviews} icon={Users2} accent="purple" />
        <StatCard label="Selected" value={stats.selected} icon={Award} accent="brand" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="card p-6 lg:col-span-1">
          <h2 className="font-semibold text-ink-900 mb-1">Applications by Status</h2>
          <p className="text-xs text-ink-400 mb-2">Across all {stats.totalApplications} applications</p>
          <SimpleBarChart data={chartData} />
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-ink-100">
            <h2 className="font-semibold text-ink-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-sm text-brand-700 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-ink-400 text-sm">Loading…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                    <th className="px-5 py-3 font-medium">Applicant</th>
                    <th className="px-5 py-3 font-medium">Job</th>
                    <th className="px-5 py-3 font-medium">Applied Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id} className="border-b border-ink-50 last:border-0">
                      <td className="px-5 py-3.5 font-medium text-ink-800">{a.applicantName}</td>
                      <td className="px-5 py-3.5 text-ink-500">{a.jobTitle}</td>
                      <td className="px-5 py-3.5 text-ink-500">{formatDate(a.appliedDate)}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                      <td className="px-5 py-3.5">
                        <Link to="/admin/applications" className="text-brand-700 font-medium hover:underline">Review</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
