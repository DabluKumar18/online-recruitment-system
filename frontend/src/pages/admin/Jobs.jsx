import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Briefcase, Search } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import { getJobs, deleteJob, getApplications } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";

export default function AdminJobs() {
  const { showToast } = useApp();
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [allJobs, allApps] = await Promise.all([getJobs(), getApplications()]);
    setJobs(allJobs);
    const counts = {};
    allApps.forEach((a) => { counts[a.jobId] = (counts[a.jobId] || 0) + 1; });
    setAppCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = jobs.filter(
    (j) => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    setDeleting(true);
    await deleteJob(toDelete.id);
    setJobs((prev) => prev.filter((j) => j.id !== toDelete.id));
    showToast(`"${toDelete.title}" was deleted.`);
    setDeleting(false);
    setToDelete(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Job Posts</h1>
          <p className="text-ink-500 text-sm mt-1">Manage all job listings on HireHub.</p>
        </div>
        <Link to="/admin/jobs/create" className="btn-primary">
          <Plus size={16} /> Create New Job
        </Link>
      </div>

      <div className="card p-3 mt-6 flex items-center gap-2">
        <Search size={16} className="text-ink-400 ml-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title or company…"
          className="w-full py-2 text-sm focus:outline-none"
        />
      </div>

      <div className="card mt-4 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-ink-400 text-sm">Loading jobs…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Briefcase} title="No jobs found" description="Try a different search or create a new job posting." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Job ID</th>
                  <th className="px-5 py-3 font-medium">Job Title</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Posted</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                    <td className="px-5 py-3.5 text-ink-400 text-xs">{job.id}</td>
                    <td className="px-5 py-3.5 font-medium text-ink-800">{job.title}</td>
                    <td className="px-5 py-3.5 text-ink-500">{job.company}</td>
                    <td className="px-5 py-3.5 text-ink-500">{job.location}</td>
                    <td className="px-5 py-3.5 text-ink-500">{job.type}</td>
                    <td className="px-5 py-3.5 text-ink-500">{appCounts[job.id] || 0}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={job.status} /></td>
                    <td className="px-5 py-3.5 text-ink-500">{formatDate(job.postedDate)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/jobs/${job.id}`} target="_blank" className="p-2 text-ink-400 hover:text-brand-700 hover:bg-ink-100 rounded-lg" title="View">
                          <Eye size={15} />
                        </Link>
                        <Link to={`/admin/jobs/${job.id}/edit`} className="p-2 text-ink-400 hover:text-brand-700 hover:bg-ink-100 rounded-lg" title="Edit">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => setToDelete(job)} className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this job?"
        description={`Are you sure you want to delete "${toDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
