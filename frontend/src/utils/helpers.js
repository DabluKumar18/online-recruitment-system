export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(dateStr) {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => /^[+]?[\d\s-]{7,15}$/.test(phone);

export function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export const statusStyles = {
  Applied: "bg-ink-100 text-ink-700",
  "Under Review": "bg-amber-100 text-amber-800",
  Shortlisted: "bg-blue-100 text-blue-700",
  Interview: "bg-purple-100 text-purple-700",
  Selected: "bg-brand-100 text-brand-800",
  Rejected: "bg-red-100 text-red-700",
  Active: "bg-brand-100 text-brand-800",
  Draft: "bg-ink-100 text-ink-600",
  Closed: "bg-red-100 text-red-700",
};
