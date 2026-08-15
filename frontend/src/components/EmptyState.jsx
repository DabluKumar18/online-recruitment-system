export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16 px-4">
      {Icon && (
        <div className="mx-auto h-14 w-14 rounded-2xl bg-ink-100 flex items-center justify-center text-ink-400 mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base font-semibold text-ink-800">{title}</h3>
      {description && <p className="text-sm text-ink-500 mt-1.5 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
