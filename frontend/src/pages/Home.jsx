import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Compass, MousePointerClick, LineChart, TrendingUp, ArrowRight } from "lucide-react";
import JobCard from "../components/JobCard";
import { getJobs } from "../services/api";

const features = [
  { icon: Compass, title: "Find Opportunities", desc: "Browse thousands of curated roles across every major industry and experience level." },
  { icon: MousePointerClick, title: "Easy Applications", desc: "Apply in minutes with a streamlined form and reusable profile details." },
  { icon: LineChart, title: "Track Applications", desc: "Follow every application's journey from submission through to an offer." },
  { icon: TrendingUp, title: "Career Growth", desc: "Get matched with roles suited to your skills as your career evolves." },
];

const stats = [
  { value: "1,200+", label: "Jobs" },
  { value: "850+", label: "Companies" },
  { value: "8,500+", label: "Applicants" },
  { value: "3,200+", label: "Successful Hires" },
];

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getJobs().then((jobs) => setFeaturedJobs(jobs.slice(0, 6)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />
        <div className="container-page relative py-20 md:py-28 text-center">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-brand-300 bg-brand-900/50 border border-brand-700/50 rounded-full px-3 py-1 mb-6">
            Now hiring across 850+ companies
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
            Find the Right Job. <span className="text-brand-400">Build Your Future.</span>
          </h1>
          <p className="text-ink-300 mt-5 max-w-xl mx-auto text-base md:text-lg">
            Search open roles, apply in minutes, and track every application in one place.
          </p>

          <form onSubmit={handleSearch} className="mt-10 bg-white rounded-2xl p-2.5 md:p-2 shadow-pop max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search size={17} className="text-ink-400 shrink-0" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
            <div className="hidden md:block w-px bg-ink-100 my-1" />
            <div className="flex items-center gap-2 flex-1 px-3">
              <MapPin size={17} className="text-ink-400 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full py-2.5 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary py-3 px-6">
              <Search size={16} /> Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ink-100 bg-white">
        <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-ink-900">{s.value}</p>
              <p className="text-xs md:text-sm text-ink-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="container-page py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-600 mb-2">Fresh this week</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink-900">Featured Jobs</h2>
          </div>
          <a href="/jobs" className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
            View all jobs <ArrowRight size={15} />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white border-y border-ink-100">
        <div className="container-page py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-wide uppercase text-brand-600 mb-2">Why HireHub</p>
            <h2 className="text-2xl md:text-3xl font-bold text-ink-900">Everything you need to land your next role</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50/40 transition-colors">
                <div className="h-11 w-11 rounded-xl bg-brand-700 text-white flex items-center justify-center mb-4">
                  <Icon size={19} />
                </div>
                <h3 className="font-semibold text-ink-900 mb-1.5">{title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16 md:py-20">
        <div className="rounded-2xl bg-brand-800 px-8 py-14 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to take the next step?</h2>
          <p className="text-brand-100 mb-7 max-w-md mx-auto">Create your free profile and start applying to roles that match your skills.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register" className="btn-amber">Create Free Account</a>
            <a href="/jobs" className="btn bg-brand-700 text-white hover:bg-brand-600 px-5 py-2.5 text-sm border border-brand-600">Browse Jobs</a>
          </div>
        </div>
      </section>
    </div>
  );
}
