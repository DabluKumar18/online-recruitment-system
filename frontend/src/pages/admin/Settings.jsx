import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, LogOut } from "lucide-react";
import FormField from "../../components/FormField";
import { useApp } from "../../context/AppContext";

export default function Settings() {
  const { currentUser, logout, showToast } = useApp();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ fullName: currentUser?.fullName || "", email: currentUser?.email || "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState({ newApplications: true, statusUpdates: true, weeklySummary: false });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast("Profile settings saved.");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) return showToast("Please fill in all password fields.", "error");
    if (passwords.next !== passwords.confirm) return showToast("New passwords do not match.", "error");
    setPasswords({ current: "", next: "", confirm: "" });
    showToast("Password updated successfully.");
  };

  const toggleNotification = (key) => setNotifications((n) => ({ ...n, [key]: !n[key] }));

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
      <p className="text-ink-500 text-sm mt-1">Manage your admin account and preferences.</p>

      <form onSubmit={handleSaveProfile} className="card p-6 mt-7 space-y-4">
        <h2 className="font-semibold text-ink-900">Admin Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Full Name">
            <input className="input" value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
          </FormField>
          <FormField label="Email">
            <input className="input" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          </FormField>
        </div>
        <div className="flex justify-end"><button type="submit" className="btn-primary"><Save size={15} /> Save Profile</button></div>
      </form>

      <form onSubmit={handleChangePassword} className="card p-6 mt-6 space-y-4">
        <h2 className="font-semibold text-ink-900">Change Password</h2>
        <FormField label="Current Password">
          <input type="password" className="input" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} />
        </FormField>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="New Password">
            <input type="password" className="input" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} />
          </FormField>
          <FormField label="Confirm New Password">
            <input type="password" className="input" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />
          </FormField>
        </div>
        <div className="flex justify-end"><button type="submit" className="btn-primary"><Save size={15} /> Update Password</button></div>
      </form>

      <div className="card p-6 mt-6 space-y-4">
        <h2 className="font-semibold text-ink-900">Notification Preferences</h2>
        {[
          { key: "newApplications", label: "Email me when a new application is submitted" },
          { key: "statusUpdates", label: "Email me when an application status changes" },
          { key: "weeklySummary", label: "Send me a weekly hiring summary" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-ink-700">{label}</span>
            <button
              type="button"
              onClick={() => toggleNotification(key)}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-brand-600" : "bg-ink-200"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </label>
        ))}
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-ink-900 mb-1">Log out</h2>
        <p className="text-sm text-ink-500 mb-4">Sign out of the HireHub admin panel on this device.</p>
        <button onClick={handleLogout} className="btn-danger"><LogOut size={15} /> Logout</button>
      </div>
    </div>
  );
}
