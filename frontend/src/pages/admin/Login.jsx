import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Info } from "lucide-react";
import FormField from "../../components/FormField";
import { useApp } from "../../context/AppContext";

export default function AdminLogin() {
  const { login, showToast, currentUser } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (currentUser?.role === "admin") navigate("/admin/dashboard");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.password.trim()) errs.password = "Password is required.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== "admin") {
        setErrors({ form: "These credentials belong to an applicant account. Use the applicant login instead." });
        return;
      }
      showToast(`Welcome back, ${user.fullName.split(" ")[0]}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-14 bg-ink-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-white">
            <span className="h-9 w-9 rounded-lg bg-brand-600 text-white flex items-center justify-center"><ShieldCheck size={18} /></span>
            HireHub Admin
          </Link>
          <p className="text-sm text-ink-400 mt-3">Sign in to manage jobs and applications.</p>
        </div>

        <div className="card p-7">
          {errors.form && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{errors.form}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" required error={errors.email}>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="admin@example.com" />
              </div>
            </FormField>
            <FormField label="Password" required error={errors.password}>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-10" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
              </div>
            </FormField>
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Signing in…" : "Login to Admin Panel"}
            </button>
          </form>
        </div>

        <div className="mt-5 flex items-start gap-2 text-xs text-ink-300 bg-ink-800 rounded-lg px-3.5 py-3">
          <Info size={14} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-white mb-1">Demo credentials</p>
            <p>admin@example.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
