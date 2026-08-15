import { Link } from "react-router-dom";
import { MapPin, Briefcase, Wallet, Clock, Bookmark } from "lucide-react";
import { timeAgo } from "../utils/helpers";

export default function JobCard({ job, saved = false, onToggleSave }) {
  return (
    <div className="card p-5 flex flex-col hover:shadow-pop transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-brand-700 text-white flex items-center justify-center font-display font-semibold text-sm shrink-0">
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-ink-900 leading-tight">{job.title}</h3>
            <p className="text-sm text-ink-500">{job.company}</p>
          </div>
        </div>
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(job.id)}
            aria-label="Save job"
            className={`p-2 rounded-lg border transition-colors ${
              saved ? "bg-amber-50 border-amber-200 text-amber-600" : "border-ink-200 text-ink-400 hover:text-ink-600"
            }`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-ink-500">
        <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={13} /> {job.type}</span>
        <span className="flex items-center gap-1"><Wallet size={13} /> {job.salary}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.skills?.slice(0, 3).map((s) => (
          <span key={s} className="text-[11px] px-2 py-1 rounded-md bg-ink-50 text-ink-600 border border-ink-100">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-100">
        <span className="text-xs text-ink-400 flex items-center gap-1">
          <Clock size={12} /> {timeAgo(job.postedDate)}
        </span>
        <Link to={`/jobs/${job.id}`} className="btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}
