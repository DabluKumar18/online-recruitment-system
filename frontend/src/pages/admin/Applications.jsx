import { useEffect, useState } from "react";
import { Search, FileText } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import {
  getAdminApplications,
  getJobs,
  updateApplicationStatus
} from "../../services/api";
import { formatDate, statusStyles } from "../../utils/helpers";
import { statusFlow } from "../../data/applications";
import { useApp } from "../../context/AppContext";

const allStatuses = [
  "Pending",
  "Shortlisted",
  "Rejected",
  "Selected"
];
export default function AdminApplications() {
  const { showToast } = useApp();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameFilter, setNameFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    try {
      setLoading(true);

      const [apps, allJobs] = await Promise.all([
        getAdminApplications(),
        getJobs()
      ]);

      setApplications(apps);
      setJobs(allJobs);
    } catch (error) {
      showToast(
        error.message || "Failed to load applications.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const jobsById = Object.fromEntries(
    jobs.map((j) => [j.id || j._id, j])
  );

  const filtered = applications.filter((app) => {
    const applicant = app.applicant;

    if (
      nameFilter &&
      !applicant?.name
        ?.toLowerCase()
        .includes(nameFilter.toLowerCase())
    ) {
      return false;
    }

    const applicationJobId =
      app.job?._id || app.job?.id || app.jobId;

    if (jobFilter && applicationJobId !== jobFilter) {
      return false;
    }

    if (statusFilter && app.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleStatusChange = async (app, newStatus) => {
    try {
      const applicationId = app._id || app.id;

      await updateApplicationStatus(
        applicationId,
        newStatus
      );

      setApplications((prev) =>
        prev.map((a) =>
          (a._id || a.id) === applicationId
            ? { ...a, status: newStatus }
            : a
        )
      );

      const applicant = app.applicant;

      showToast(
        `${applicant?.name || "Applicant"}'s status updated to "${newStatus}".`
      );
    } catch (error) {
      showToast(
        error.message || "Failed to update application status.",
        "error"
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">
        Applications
      </h1>

      <p className="text-ink-500 text-sm mt-1">
        Review and update the status of every application.
      </p>

      <div className="card p-4 mt-6 grid sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 border border-ink-200 rounded-lg px-3">
          <Search size={15} className="text-ink-400" />

          <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Search applicant name…"
            className="w-full py-2 text-sm focus:outline-none"
          />
        </div>

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="input"
        >
          <option value="">All Jobs</option>

          {jobs.map((j) => (
            <option
              key={j.id || j._id}
              value={j.id || j._id}
            >
              {j.title}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="">All Statuses</option>

          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="card mt-4 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-ink-400 text-sm">
            Loading applications…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="Try adjusting your filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">
                    Applicant
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Job
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Email
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Applied Date
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Update Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((app) => {
                  const applicant = app.applicant;

                  const jobId =
                    app.job?._id ||
                    app.job?.id ||
                    app.jobId;

                  const job =
                    app.job || jobsById[jobId];

                  return (
                    <tr
                      key={app._id || app.id}
                      className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60"
                    >
                      <td className="px-5 py-3.5 font-medium text-ink-800">
                        {applicant?.name || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-ink-500">
                        {job?.title || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-ink-500">
                        {applicant?.email || "—"}
                      </td>

                      <td className="px-5 py-3.5 text-ink-500">
                        {formatDate(
                          app.createdAt || app.appliedDate
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="px-5 py-3.5">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(
                              app,
                              e.target.value
                            )
                          }
                          className={`text-xs rounded-lg border border-ink-200 px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
                            statusStyles[app.status]
                          }`}
                        >
                          {allStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}