import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} card p-6 animate-[fadeIn_0.15s_ease-out] max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 -mt-1 -mr-1 p-1 rounded-lg hover:bg-ink-100">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
