import { useState } from "react";
import FormField from "./FormField";
import { jobTypes, experienceLevels, workModes, categories } from "../data/jobs";

const emptyForm = {
  title: "", company: "", location: "", type: "Full Time", workMode: "On-site",
  category: "Software Development", experience: "Entry Level", salary: "",
  openings: "1", deadline: "", description: "", responsibilities: "",
  skills: "", qualifications: "", benefits: "",
};

function toMultiline(arr) { return Array.isArray(arr) ? arr.join("\n") : arr || ""; }
function fromMultiline(str) { return str.split("\n").map((s) => s.trim()).filter(Boolean); }
function toCsv(arr) { return Array.isArray(arr) ? arr.join(", ") : arr || ""; }
function fromCsv(str) { return str.split(",").map((s) => s.trim()).filter(Boolean); }

export default function JobForm({ initialJob, onSubmit, submitLabel = "Publish Job" }) {
  const [form, setForm] = useState(() =>
    initialJob
      ? {
          ...emptyForm,
          ...initialJob,
          openings: String(initialJob.openings ?? "1"),
          responsibilities: toMultiline(initialJob.responsibilities),
          qualifications: toMultiline(initialJob.qualifications),
          benefits: toMultiline(initialJob.benefits),
          skills: toCsv(initialJob.skills),
        }
      : emptyForm
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    ["title", "company", "location", "salary", "deadline", "description"].forEach((key) => {
      if (!form[key]?.trim()) e[key] = "This field is required.";
    });
    if (!form.responsibilities.trim()) e.responsibilities = "Add at least one responsibility.";
    if (!form.skills.trim()) e.skills = "Add at least one skill.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = (status) => ({
    ...form,
    status,
    openings: Number(form.openings) || 1,
    responsibilities: fromMultiline(form.responsibilities),
    qualifications: fromMultiline(form.qualifications),
    benefits: fromMultiline(form.benefits),
    skills: fromCsv(form.skills),
  });

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onSubmit(buildPayload("Active"));
    setSubmitting(false);
  };

  const handleDraft = async () => {
    setSubmitting(true);
    await onSubmit(buildPayload("Draft"));
    setSubmitting(false);
  };

  return (
    <form onSubmit={handlePublish} className="space-y-6">
      <section className="card p-6 grid sm:grid-cols-2 gap-4">
        <FormField label="Job Title" required error={errors.title}>
          <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </FormField>
        <FormField label="Company Name" required error={errors.company}>
          <input className="input" value={form.company} onChange={(e) => update("company", e.target.value)} />
        </FormField>
        <FormField label="Location" required error={errors.location}>
          <input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} />
        </FormField>
        <FormField label="Job Type">
          <select className="input" value={form.type} onChange={(e) => update("type", e.target.value)}>
            {jobTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Work Mode">
          <select className="input" value={form.workMode} onChange={(e) => update("workMode", e.target.value)}>
            {workModes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Category">
          <select className="input" value={form.category} onChange={(e) => update("category", e.target.value)}>
            {categories.map((t) => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Experience Level">
          <select className="input" value={form.experience} onChange={(e) => update("experience", e.target.value)}>
            {experienceLevels.map((t) => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Salary" required error={errors.salary} hint="e.g. ₹9,00,000 - ₹14,00,000 / yr">
          <input className="input" value={form.salary} onChange={(e) => update("salary", e.target.value)} />
        </FormField>
        <FormField label="Number of Openings">
          <input type="number" min="1" className="input" value={form.openings} onChange={(e) => update("openings", e.target.value)} />
        </FormField>
        <FormField label="Application Deadline" required error={errors.deadline}>
          <input type="date" className="input" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
        </FormField>
      </section>

      <section className="card p-6 space-y-4">
        <FormField label="Description" required error={errors.description}>
          <textarea rows={3} className="input resize-none" value={form.description} onChange={(e) => update("description", e.target.value)} />
        </FormField>
        <FormField label="Responsibilities" required error={errors.responsibilities} hint="One per line">
          <textarea rows={4} className="input resize-none" value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} />
        </FormField>
        <FormField label="Required Skills" required error={errors.skills} hint="Comma-separated">
          <input className="input" value={form.skills} onChange={(e) => update("skills", e.target.value)} />
        </FormField>
        <FormField label="Qualifications" hint="One per line">
          <textarea rows={3} className="input resize-none" value={form.qualifications} onChange={(e) => update("qualifications", e.target.value)} />
        </FormField>
        <FormField label="Benefits" hint="One per line">
          <textarea rows={3} className="input resize-none" value={form.benefits} onChange={(e) => update("benefits", e.target.value)} />
        </FormField>
      </section>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={handleDraft} disabled={submitting} className="btn-secondary">Save Draft</button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
