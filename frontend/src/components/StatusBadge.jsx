import { statusStyles } from "../utils/helpers";

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || "bg-ink-100 text-ink-600";
  return <span className={`badge ${style}`}>{status}</span>;
}
