import { Target, Users, Building2 } from "lucide-react";

export default function About() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-wide uppercase text-brand-600 mb-2">About HireHub</p>
        <h1 className="text-3xl md:text-4xl font-bold text-ink-900 mb-5">Connecting talent with opportunity</h1>
        <p className="text-ink-600 leading-relaxed">
          HireHub is a recruitment platform built to make job searching and hiring simple for both applicants and companies.
          Applicants can search and filter open roles, apply in a few clicks, and track every application's progress.
          Employers can post jobs, manage applications, and review candidates from a single dashboard.
        </p>
        <p className="text-ink-600 leading-relaxed mt-4">
          This project is a student-built frontend demo. It currently runs on mock data and browser storage, and is
          structured so a Node.js, Express, and MongoDB backend can be connected without reworking the interface.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-14">
        {[
          { icon: Target, title: "Our Mission", desc: "Make finding the right role — and the right hire — fast and frustration-free." },
          { icon: Users, title: "For Applicants", desc: "A clear view of every application's status, from submission to offer." },
          { icon: Building2, title: "For Employers", desc: "Tools to post jobs, manage candidates, and hire with confidence." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6">
            <div className="h-11 w-11 rounded-xl bg-brand-700 text-white flex items-center justify-center mb-4">
              <Icon size={19} />
            </div>
            <h3 className="font-semibold text-ink-900 mb-1.5">{title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
