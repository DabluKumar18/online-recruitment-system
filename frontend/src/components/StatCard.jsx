export default function StatCard({ label, value, icon: Icon, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
    ink: "bg-ink-100 text-ink-700",
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      {Icon && (
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accents[accent]}`}>
          <Icon size={20} />
        </div>
      )}
      <div>
        <p className="text-2xl font-display font-bold text-ink-900 leading-none">{value}</p>
        <p className="text-xs text-ink-500 mt-1.5">{label}</p>
      </div>
    </div>
  );
}
