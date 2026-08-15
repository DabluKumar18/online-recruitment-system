export default function FormField({ label, error, children, required, hint }) {
  return (
    <div>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
