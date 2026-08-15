// A dependency-free bar chart built with plain CSS/flexbox, per project constraints
// (no charting library required).
export default function SimpleBarChart({ data, valueKey = "value", labelKey = "label", colorClass = "bg-brand-600" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-3 h-48 pt-4">
      {data.map((d) => (
        <div key={d[labelKey]} className="flex-1 flex flex-col items-center justify-end h-full group">
          <span className="text-xs font-semibold text-ink-700 mb-1.5">{d[valueKey]}</span>
          <div
            className={`w-full rounded-t-md ${colorClass} transition-all duration-300 group-hover:opacity-80`}
            style={{ height: `${Math.max((d[valueKey] / max) * 100, 4)}%` }}
          />
          <span className="text-[11px] text-ink-500 mt-2 text-center leading-tight">{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}
