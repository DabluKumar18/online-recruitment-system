import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import JobForm from "../../components/JobForm";
import { getJobById, updateJob } from "../../services/api";
import { useApp } from "../../context/AppContext";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [job, setJob] = useState(undefined);

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateJob(id, payload);
    showToast(`"${payload.title}" updated successfully.`);
    navigate("/admin/jobs");
  };

  if (job === undefined) return <div className="py-16 text-center text-ink-400">Loading job…</div>;
  if (job === null) return <div className="py-16 text-center text-ink-400">Job not found.</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft size={15} /> Back to Job Posts
      </Link>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Edit Job</h1>
      <JobForm initialJob={job} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
