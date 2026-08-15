import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, FileText, Users2 } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import { getApplicants, getApplications } from "../../services/api";
import { useApp } from "../../context/AppContext";

export default function AdminApplicants() {
  const { showToast } = useApp();
  const [applicants, setApplicants] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allApplicants, allApps] = await Promise.all([getApplicants(), getApplications()]);
      setApplicants(allApplicants);
      const counts = {};
      allApps.forEach((a) => { counts[a.applicantId] = (counts[a.applicantId] || 0) + 1; });
      setAppCounts(counts);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = applicants.filter(
    (a) => a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Applicants</h1>
      <p className="text-ink-500 text-sm mt-1">Browse everyone who has registered on HireHub.</p>

      <div className="card p-3 mt-6 flex items-center gap-2">
        <Search size={16} className="text-ink-400 ml-2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="w-full py-2 text-sm focus:outline-none" />
      </div>

      <div className="card mt-4 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-ink-400 text-sm">Loading applicants…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users2} title="No applicants found" description="Try a different search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-400 text-xs border-b border-ink-100">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Skills</th>
                  <th className="px-5 py-3 font-medium">Experience</th>
                  <th className="px-5 py-3 font-medium">Applications</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                    <td className="px-5 py-3.5 font-medium text-ink-800">{a.fullName}</td>
                    <td className="px-5 py-3.5 text-ink-500">{a.email}</td>
                    <td className="px-5 py-3.5 text-ink-500">{a.phone}</td>
                    <td className="px-5 py-3.5 text-ink-500">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(a.skills || []).slice(0, 3).map((s) => (
                          <span key={s} className="text-[11px] px-1.5 py-0.5 rounded bg-ink-100 text-ink-600">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-ink-500">{a.experience || "—"}</td>
                    <td className="px-5 py-3.5 text-ink-500">{appCounts[a.id] || 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/applicants/${a.id}`} className="p-2 text-ink-400 hover:text-brand-700 hover:bg-ink-100 rounded-lg" title="View">
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => showToast(a.resume ? `Opening ${a.resume}…` : "No resume uploaded for this applicant.", a.resume ? "success" : "error")}
                          className="p-2 text-ink-400 hover:text-brand-700 hover:bg-ink-100 rounded-lg"
                          title="View Resume"
                        >
                          <FileText size={15} />
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
    </div>
  );
}
