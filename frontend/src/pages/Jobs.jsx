import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, X, SearchX } from "lucide-react";
import JobCard from "../components/JobCard";
import EmptyState from "../components/EmptyState";
import { getJobs, getSavedJobs, toggleSavedJob } from "../services/api";
import { jobTypes, experienceLevels, workModes, categories } from "../data/jobs";
import { useApp } from "../context/AppContext";

const emptyFilters = { type: "", experience: "", workMode: "", category: "" };

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useApp();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [filters, setFilters] = useState(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);

  const runSearch = useCallback(async () => {
    setLoading(true);
    const results = await getJobs({ keyword, location, ...filters });
    setJobs(results);
    setLoading(false);
  }, [keyword, location, filters]);

  useEffect(() => {
    runSearch();
  }, [runSearch]);

  useEffect(() => {
    if (currentUser) getSavedJobs(currentUser.id).then(setSavedJobs);
  }, [currentUser]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ keyword, location });
    runSearch();
  };

  const handleFilterChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const clearFilters = () => setFilters(emptyFilters);

  const handleToggleSave = async (jobId) => {
    if (!currentUser) return alert("Please login to save jobs.");
    const updated = await toggleSavedJob(currentUser.id, jobId);
    setSavedJobs(updated);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-ink-900">Find Jobs</h1>
        <p className="text-ink-500 text-sm mt-1">{loading ? "Searching…" : `${jobs.length} jobs found`}</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="card p-3 flex flex-col md:flex-row gap-2 mb-6">
        <div className="flex items-center gap-2 flex-1 px-3">
          <Search size={17} className="text-ink-400 shrink-0" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title, company, or skill"
            className="w-full py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="hidden md:block w-px bg-ink-100 my-1" />
        <div className="flex items-center gap-2 flex-1 px-3">
          <MapPin size={17} className="text-ink-400 shrink-0" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full py-2 text-sm focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
          <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </form>

      {showFilters && (
        <div className="card p-5 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FilterSelect label="Job Type" value={filters.type} options={jobTypes} onChange={(v) => handleFilterChange("type", v)} />
          <FilterSelect label="Experience" value={filters.experience} options={experienceLevels} onChange={(v) => handleFilterChange("experience", v)} />
          <FilterSelect label="Work Mode" value={filters.workMode} options={workModes} onChange={(v) => handleFilterChange("workMode", v)} />
          <FilterSelect label="Category" value={filters.category} options={categories} onChange={(v) => handleFilterChange("category", v)} />
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-1">
            <button onClick={clearFilters} className="btn-ghost">
              <X size={14} /> Clear Filters
            </button>
            <button onClick={runSearch} className="btn-primary btn-sm">Apply Filters</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-48 animate-pulse bg-ink-50" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No jobs match your search"
          description="Try adjusting your keyword, location, or filters."
          action={<button onClick={() => { setKeyword(""); setLocation(""); clearFilters(); }} className="btn-secondary">Reset Search</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
