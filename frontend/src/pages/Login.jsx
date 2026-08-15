import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Mail, Lock, Info } from "lucide-react";
import FormField from "../components/FormField";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password.trim()) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.fullName.split(" ")[0]}!`);
      const redirectTo = location.state?.from?.pathname || (user.role === "admin" ? "/admin/dashboard" : "/applicant/dashboard");
      navigate(redirectTo);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14 bg-ink-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-ink-900">
            <span className="h-9 w-9 rounded-lg bg-brand-700 text-white flex items-center justify-center"><Briefcase size={18} /></span>
            HireHub
          </Link>
          <h1 className="text-xl font-bold text-ink-900 mt-6">Welcome back</h1>
          <p className="text-sm text-ink-500 mt-1">Login to track your applications and saved jobs.</p>
        </div>

        <div className="card p-7">
          {errors.form && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{errors.form}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" required error={errors.email}>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
              </div>
            </FormField>
            <FormField label="Password" required error={errors.password}>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-10" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
              </div>
            </FormField>

            <div className="flex justify-end">
              <button type="button" onClick={() => setShowForgot(true)} className="text-xs text-brand-700 hover:underline">Forgot password?</button>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Don't have an account? <Link to="/register" className="text-brand-700 font-medium hover:underline">Register</Link>
          </p>
        </div>

        <div className="mt-5 flex items-start gap-2 text-xs text-ink-500 bg-ink-100 rounded-lg px-3.5 py-3">
          <Info size={14} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-ink-700 mb-1">Demo credentials</p>
            <p>Applicant: applicant@example.com / 123456</p>
            <p>Admin: use the <Link to="/admin/login" className="underline">Admin Login</Link> page</p>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setShowForgot(false)} />
          <div className="relative card p-6 max-w-sm w-full">
            <h3 className="font-semibold text-ink-900 mb-2">Reset your password</h3>
            <p className="text-sm text-ink-500 mb-4">Enter your email and we'll send you a reset link. (This is a frontend demo — no email will actually be sent.)</p>
            <input className="input mb-4" placeholder="you@example.com" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForgot(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  setShowForgot(false);
                  showToast("If an account exists for that email, a reset link has been sent.");
                }}
                className="btn-primary"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
