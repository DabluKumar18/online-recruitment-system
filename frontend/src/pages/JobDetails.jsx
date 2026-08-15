import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin, Briefcase, Wallet, Clock, Users2, Building2, Bookmark, CheckCircle2, ArrowLeft,
} from "lucide-react";
import { getJobById, getSavedJobs, toggleSavedJob, hasApplied } from "../services/api";
import { formatDate } from "../utils/helpers";
import { useApp } from "../context/AppContext";
import ApplicationForm from "../components/ApplicationForm";
import EmptyState from "../components/EmptyState";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isApplicant, showToast } = useApp();

  const [job, setJob] = useState(undefined);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    getJobById(id).then(setJob);
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      getSavedJobs(currentUser.id).then((list) => setSaved(list.includes(id)));
      hasApplied(currentUser.id, id).then(setApplied);
    }
  }, [currentUser, id]);

  const handleApplyClick = () => {
    if (!currentUser) {
      showToast("Please login to apply for this job.", "error");
      return navigate("/login");
    }
    if (!isApplicant) {
      showToast("Only applicant accounts can apply for jobs.", "error");
      return;
    }
    if (applied) return;
    setShowApplyForm(true);
  };

  const handleSave = async () => {
    if (!currentUser) return navigate("/login");
    const updated = await toggleSavedJob(currentUser.id, id);
    setSaved(updated.includes(id));
  };

  if (job === undefined) {
    return <div className="container-page py-20 text-center text-ink-400">Loading job…</div>;
  }

  if (job === null) {
    return (
      <div className="container-page py-20">
        <EmptyState
          title="Job not found"
          description="This job posting may have been removed or the link is incorrect."
          action={<Link to="/jobs" className="btn-primary">Browse Jobs</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6">
        <ArrowLeft size={15} /> Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-brand-700 text-white flex items-center justify-center font-display font-bold shrink-0">
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-ink-900">{job.title}</h1>
                <p className="text-ink-500 mt-1">{job.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-ink-100">
              <InfoItem icon={MapPin} label="Location" value={job.location} />
              <InfoItem icon={Briefcase} label="Job Type" value={job.type} />
              <InfoItem icon={Wallet} label="Salary" value={job.salary} />
              <InfoItem icon={Users2} label="Experience" value={job.experience} />
              <InfoItem icon={Building2} label="Work Mode" value={job.workMode} />
              <InfoItem icon={Clock} label="Openings" value={`${job.openings} positions`} />
            </div>
          </div>

          <Section title="Job Description"><p className="text-sm text-ink-600 leading-relaxed">{job.description}</p></Section>
          <Section title="Responsibilities"><BulletList items={job.responsibilities} /></Section>
          <Section title="Required Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100">{s}</span>
              ))}
            </div>
          </Section>
          <Section title="Qualifications"><BulletList items={job.qualifications} /></Section>
          <Section title="Benefits"><BulletList items={job.benefits} /></Section>
          <Section title="About the Company"><p className="text-sm text-ink-600 leading-relaxed">{job.about}</p></Section>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24 space-y-4">
            <p className="text-xs text-ink-400">Posted {formatDate(job.postedDate)} &middot; Apply before {formatDate(job.deadline)}</p>

            {applied ? (
              <div className="flex items-center gap-2 text-brand-700 bg-brand-50 border border-brand-100 rounded-lg px-3 py-3 text-sm font-medium">
                <CheckCircle2 size={17} /> You've already applied to this job
              </div>
            ) : (
              <button onClick={handleApplyClick} className="btn-primary w-full py-3">Apply Now</button>
            )}
            <button onClick={handleSave} className={`btn-secondary w-full ${saved ? "bg-amber-50 border-amber-200 text-amber-700" : ""}`}>
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save Job"}
            </button>

            {applied && (
              <Link to="/applicant/applications" className="block text-center text-sm text-brand-700 hover:underline pt-1">
                View in My Applications
              </Link>
            )}
          </div>
        </div>
      </div>

      {showApplyForm && (
        <ApplicationForm
          job={job}
          open={showApplyForm}
          onClose={() => setShowApplyForm(false)}
          onSuccess={() => {
            setShowApplyForm(false);
            navigate("/applicant/applications");
          }}
        />
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="text-brand-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-800">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-ink-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}
