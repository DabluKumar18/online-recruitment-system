import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, User, Mail, Phone, Lock } from "lucide-react";
import FormField from "../components/FormField";
import { isValidEmail, isValidPhone } from "../utils/helpers";
import { useApp } from "../context/AppContext";

export default function Register() {
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register(form);

      showToast(
       `Account created — welcome, ${user.fullName.split(" ")[0]}!`
);

navigate("/applicant/dashboard");
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
          <h1 className="text-xl font-bold text-ink-900 mt-6">Create your account</h1>
          <p className="text-sm text-ink-500 mt-1">Start applying to jobs in minutes.</p>
        </div>

        <div className="card p-7">
          {errors.form && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{errors.form}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name" required error={errors.fullName}>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Jordan Lee" />
              </div>
            </FormField>
            <FormField label="Email" required error={errors.email}>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
              </div>
            </FormField>
            <FormField label="Phone" required error={errors.phone}>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="input pl-10" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </FormField>
            <FormField label="Password" required error={errors.password} hint="At least 6 characters">
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-10" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" />
              </div>
            </FormField>
            <FormField label="Confirm Password" required error={errors.confirmPassword}>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input type="password" className="input pl-10" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="••••••••" />
              </div>
            </FormField>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Already have an account? <Link to="/login" className="text-brand-700 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
