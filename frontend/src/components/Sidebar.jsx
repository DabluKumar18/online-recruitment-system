import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Briefcase as Logo,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/jobs", label: "Job Posts", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/applicants", label: "Applicants", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { logout, currentUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-ink-950/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-900 text-ink-300 flex flex-col z-40 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-800">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <span className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center"><Logo size={16} /></span>
            HireHub
          </div>
          <button className="lg:hidden text-ink-400" onClick={onClose}><X size={18} /></button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-700 text-white" : "hover:bg-ink-800 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <span className="h-9 w-9 rounded-full bg-ink-700 flex items-center justify-center text-sm font-semibold text-white">
              {currentUser?.fullName?.slice(0, 1) || "A"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.fullName || "Admin"}</p>
              <p className="text-xs text-ink-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white w-full">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
