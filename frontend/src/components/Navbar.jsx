import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Briefcase, LayoutDashboard, LogOut, User } from "lucide-react";
import { useApp } from "../context/AppContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-brand-700" : "text-ink-600 hover:text-ink-900"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isApplicant, currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-100">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink-900">
          <span className="h-8 w-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
            <Briefcase size={17} />
          </span>
          HireHub
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/jobs" className={navLinkClass}>Find Jobs</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={isApplicant ? "/applicant/dashboard" : "/admin/dashboard"}
                className="btn-secondary btn-sm"
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              
              {isApplicant && (
                <Link
                   to="/applicant/profile"
                   className="btn-secondary btn-sm"
                >
                   <User size={15} /> Profile
                </Link>
              )}
              <div className="flex items-center gap-2 pl-3 border-l border-ink-200">
                <span className="h-8 w-8 rounded-full bg-ink-100 flex items-center justify-center text-xs font-semibold text-ink-600">
                  {currentUser?.fullName?.slice(0, 1)}
                </span>
                <button onClick={handleLogout} className="text-ink-400 hover:text-red-600" aria-label="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-ink-700" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white px-4 py-4 space-y-3">
          <NavLink to="/" end onClick={() => setOpen(false)} className="block text-sm font-medium text-ink-700">Home</NavLink>
          <NavLink to="/jobs" onClick={() => setOpen(false)} className="block text-sm font-medium text-ink-700">Find Jobs</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className="block text-sm font-medium text-ink-700">About</NavLink>
          <hr className="border-ink-100" />
          {isAuthenticated ? (
            <>
              <Link
                to={isApplicant ? "/applicant/dashboard" : "/admin/dashboard"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-ink-700"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to={isApplicant ? "/applicant/profile" : "/admin/settings"} onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-ink-700">
                <User size={16} /> Profile
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary flex-1">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
