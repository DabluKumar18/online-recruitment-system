import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import JobForm from "../../components/JobForm";
import { createJob } from "../../services/api";
import { useApp } from "../../context/AppContext";

export default function CreateJob() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const handleSubmit = async (payload) => {
  try {
    const job = await createJob(payload);

    showToast(
      payload.status === "Draft"
        ? `"${job.title}" saved as draft.`
        : `"${job.title}" published successfully.`
    );

    navigate("/admin/jobs");
  } catch (error) {
    console.error("Create job error:", error);

    showToast(
      error.message || "Failed to create job.",
      "error"
    );
  }
};

  return (
    <div className="max-w-3xl">
      <Link to="/admin/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-4">
        <ArrowLeft size={15} /> Back to Job Posts
      </Link>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Create New Job</h1>
      <JobForm onSubmit={handleSubmit} submitLabel="Publish Job" />
    </div>
  );
}
