import { useEffect, useState } from "react";
import { Briefcase, FileText, Users2, ListChecks, CalendarCheck, Award } from "lucide-react";
import StatCard from "../../components/StatCard";
import SimpleBarChart from "../../components/SimpleBarChart";
import { getJobs, getApplications, getApplicants } from "../../services/api";
import { categories } from "../../data/jobs";

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    Promise.all([getJobs(), getApplications(), getApplicants()]).then(([j, a, ap]) => {
      setJobs(j); setApplications(a); setApplicants(ap);
    });
  }, []);

  const stats = {
    totalJobs: jobs.length,
    applications: applications.length,
    applicants: applicants.length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    interviews: applications.filter((a) => a.status === "Interview").length,
    selected: applications.filter((a) => a.status === "Selected").length,
  };

  const byCategory = categories.map((cat) => ({ label: cat.split(" ")[0], value: jobs.filter((j) => j.category === cat).length }));
  const byStatus = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"].map((s) => ({
    label: s, value: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Analytics</h1>
      <p className="text-ink-500 text-sm mt-1">A snapshot of hiring activity across HireHub.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-7">
        <StatCard label="Total Jobs" value={stats.totalJobs} icon={Briefcase} accent="brand" />
        <StatCard label="Applications" value={stats.applications} icon={FileText} accent="ink" />
        <StatCard label="Applicants" value={stats.applicants} icon={Users2} accent="blue" />
        <StatCard label="Shortlisted" value={stats.shortlisted} icon={ListChecks} accent="amber" />
        <StatCard label="Interviews" value={stats.interviews} icon={CalendarCheck} accent="purple" />
        <StatCard label="Selected" value={stats.selected} icon={Award} accent="brand" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-1">Jobs by Category</h2>
          <p className="text-xs text-ink-400 mb-2">Distribution of open roles</p>
          <SimpleBarChart data={byCategory} colorClass="bg-brand-600" />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-1">Applications by Status</h2>
          <p className="text-xs text-ink-400 mb-2">Where candidates stand in the pipeline</p>
          <SimpleBarChart data={byStatus} colorClass="bg-amber-500" />
        </div>
      </div>
    </div>
  );
}
