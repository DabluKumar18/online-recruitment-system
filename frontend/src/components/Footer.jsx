import { Link } from "react-router-dom";
import { Briefcase, Globe, MessageCircle, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-24">
      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-xl text-white mb-3">
            <span className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Briefcase size={17} />
            </span>
            HireHub
          </div>
          <p className="text-sm text-ink-400 max-w-sm leading-relaxed">
            Connecting ambitious talent with companies building the future. Search smarter, apply faster, and track every step of your career journey.
          </p>
          <div className="flex gap-3 mt-5">
            {[Globe, MessageCircle, AtSign].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-lg bg-ink-800 flex items-center justify-center hover:bg-brand-700 transition-colors">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><Link to="/jobs" className="hover:text-white">Find Jobs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="container-page py-5 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} HireHub. All rights reserved.</span>
          <span>Built as a student project — frontend demo with mock data.</span>
        </div>
      </div>
    </footer>
  );
}
