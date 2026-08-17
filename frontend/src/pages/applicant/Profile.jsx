import { useEffect, useState } from "react";
import { UploadCloud, FileText, Save } from "lucide-react";
import FormField from "../../components/FormField";
import {
  getMyProfile,
  updateApplicantProfile
} from "../../services/api";
import { useApp } from "../../context/AppContext";

const emptyProfile = {
  fullName: "", email: "", phone: "", location: "",
  education: { degree: "", university: "", graduationYear: "" },
  experience: "", skills: [], resume: "",
};

export default function ApplicantProfile() {
  const { currentUser, showToast } = useApp();
  const [profile, setProfile] = useState(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
  getMyProfile()
    .then((data) => {
      const merged = {
        ...emptyProfile,
        ...data,
        education: {
          ...emptyProfile.education,
          ...data?.education
        }
      };

      setProfile(merged);
      setSkillsInput((merged.skills || []).join(", "));
      setLoading(false);
    })
    .catch((err) => {
      console.error("Profile load error:", err);
      showToast(err.message || "Could not load profile.", "error");
      setLoading(false);
    });
}, []);

  const update = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const updateEducation = (key, value) => setProfile((p) => ({ ...p, education: { ...p.education, [key]: value } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = {
        ...profile,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        resume: resumeFile ? resumeFile.name : profile.resume,
      };
      await updateApplicantProfile(
        currentUser.id,
        updates,
        resumeFile
      );

       setProfile(updates);

       showToast("Profile updated successfully.");
    } catch (err) {
      showToast(err.message || "Could not save profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container-page py-20 text-center text-ink-400">Loading profile…</div>;

  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900">My Profile</h1>
      <p className="text-ink-500 text-sm mt-1">Keep your details up to date so employers see the right information.</p>

      <form onSubmit={handleSave} className="space-y-6 mt-8">
        <section className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name"><input className="input" value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} /></FormField>
            <FormField label="Email"><input className="input" value={profile.email} onChange={(e) => update("email", e.target.value)} /></FormField>
            <FormField label="Phone"><input className="input" value={profile.phone} onChange={(e) => update("phone", e.target.value)} /></FormField>
            <FormField label="Location"><input className="input" value={profile.location} onChange={(e) => update("location", e.target.value)} /></FormField>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Education</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <FormField label="Degree"><input className="input" value={profile.education.degree} onChange={(e) => updateEducation("degree", e.target.value)} /></FormField>
            <FormField label="University"><input className="input" value={profile.education.university} onChange={(e) => updateEducation("university", e.target.value)} /></FormField>
            <FormField label="Graduation Year"><input className="input" value={profile.education.graduationYear} onChange={(e) => updateEducation("graduationYear", e.target.value)} /></FormField>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-ink-900 mb-4">Professional Information</h2>
          <div className="space-y-4">
            <FormField label="Experience" hint="e.g. Fresher, or 2 years">
              <input className="input" value={profile.experience} onChange={(e) => update("experience", e.target.value)} />
            </FormField>
            <FormField label="Skills" hint="Comma-separated">
              <input className="input" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
            </FormField>
            <FormField label="Resume">
              <label className="flex items-center gap-3 border-2 border-dashed border-ink-200 rounded-lg px-4 py-4 cursor-pointer hover:border-brand-400 hover:bg-brand-50/40 transition-colors">
                <UploadCloud size={20} className="text-ink-400 shrink-0" />
                <span className="flex items-center gap-2 text-sm text-ink-700 font-medium min-w-0">
                  <FileText size={15} className="text-brand-600 shrink-0" />
                  <span className="truncate">{resumeFile ? resumeFile.name : profile.resume || "No resume uploaded"}</span>
                </span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
              </label>
            </FormField>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
