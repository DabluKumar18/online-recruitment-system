import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import ApplicationProgress from "../../components/ApplicationProgress";
import EmptyState from "../../components/EmptyState";
import { getApplications, getJobById } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

export default function ApplicantApplications() {
  const { currentUser } = useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const apps = await getApplications({ applicantId: currentUser.id });
      const withJobs = await Promise.all(apps.map(async (a) => ({ ...a, job: await getJobById(a.jobId) })));
      setRows(withJobs);
      setLoading(false);
    }
    load();
  }, [currentUser.id]);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-ink-900">My Applications</h1>
      <p className="text-ink-500 text-sm mt-1">Track the progress of every job you've applied to.</p>

      {loading ? (
        <div className="py-16 text-center text-ink-400 text-sm">Loading applications…</div>
      ) : rows.length === 0 ? (
        <div className="card mt-8">
          <EmptyState
            icon={FileText}
            title="You haven't applied to any jobs yet"
            description="Browse open roles and submit your first application."
            action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>}
          />
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {rows.map((app) => (
            <div key={app.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink-900">{app.job?.title}</h3>
                  <p className="text-sm text-ink-500">{app.job?.company} &middot; {app.job?.location}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-[11px] text-ink-400">Applied</p>
                    <p className="text-ink-700">{formatDate(app.appliedDate)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-400">Last Updated</p>
                    <p className="text-ink-700">{formatDate(app.lastUpdated)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-ink-100">
                <ApplicationProgress status={app.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
