import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import Modal from "./Modal";
import FormField from "./FormField";
import { isValidEmail, isValidPhone } from "../utils/helpers";
import { submitApplication } from "../services/api";
import { useApp } from "../context/AppContext";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  qualification: "",
  university: "",
  graduationYear: "",
  experience: "",
  skills: "",
  coverLetter: "",
};

export default function ApplicationForm({ job, open, onClose, onSuccess }) {
  const { currentUser, showToast } = useApp();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  }));
  const [resumeFile, setResumeFile] = useState(null);
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
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.qualification.trim()) e.qualification = "Qualification is required.";
    if (!form.university.trim()) e.university = "University is required.";
    if (!form.graduationYear.trim()) e.graduationYear = "Graduation year is required.";
    if (!form.coverLetter.trim()) e.coverLetter = "A short cover letter is required.";
    if (!resumeFile) e.resume = "Please select a resume file.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setErrors((prev) => ({ ...prev, resume: "Only PDF, DOC, or DOCX files are allowed." }));
      return;
    }
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitApplication({
        applicantId: currentUser.id,
        jobId: job.id,
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        resumeFileName: resumeFile.name,
      });
      showToast(`Application submitted for ${job.title} at ${job.company}.`);
      onSuccess?.();
    } catch (err) {
      showToast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Apply for ${job.title}`} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required error={errors.fullName}>
            <input className="input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <input className="input" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </FormField>
          <FormField label="Phone" required error={errors.phone}>
            <input className="input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </FormField>
          <FormField label="Address" required error={errors.address}>
            <input className="input" value={form.address} onChange={(e) => update("address", e.target.value)} />
          </FormField>
          <FormField label="Qualification" required error={errors.qualification}>
            <input className="input" placeholder="e.g. B.Tech, Computer Science" value={form.qualification} onChange={(e) => update("qualification", e.target.value)} />
          </FormField>
          <FormField label="University" required error={errors.university}>
            <input className="input" value={form.university} onChange={(e) => update("university", e.target.value)} />
          </FormField>
          <FormField label="Graduation Year" required error={errors.graduationYear}>
            <input className="input" placeholder="e.g. 2025" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} />
          </FormField>
          <FormField label="Experience" hint="e.g. Fresher, or 2 years">
            <input className="input" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
          </FormField>
        </div>

        <FormField label="Skills" hint="Comma-separated, e.g. React, Node.js, SQL">
          <input className="input" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
        </FormField>

        <FormField label="Cover Letter" required error={errors.coverLetter}>
          <textarea rows={4} className="input resize-none" value={form.coverLetter} onChange={(e) => update("coverLetter", e.target.value)} placeholder="Tell the employer why you're a great fit for this role…" />
        </FormField>

        <FormField label="Resume" required error={errors.resume} hint="Accepted formats: PDF, DOC, DOCX">
          <label className="flex items-center gap-3 border-2 border-dashed border-ink-200 rounded-lg px-4 py-4 cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-colors">
            <UploadCloud size={20} className="text-ink-400 shrink-0" />
            <div className="min-w-0">
              {resumeFile ? (
                <span className="flex items-center gap-2 text-sm text-ink-700 font-medium">
                  <FileText size={15} className="text-brand-600 shrink-0" />
                  <span className="truncate">{resumeFile.name}</span>
                </span>
              ) : (
                <span className="text-sm text-ink-500">Click to select your resume (PDF, DOC, DOCX)</span>
              )}
            </div>
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
          </label>
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
