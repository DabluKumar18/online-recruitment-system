import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-5 right-5 z-[100] animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-pop max-w-sm bg-white ${
          isError ? "border-red-200" : "border-brand-200"
        }`}
      >
        {isError ? (
          <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={20} className="text-brand-600 shrink-0 mt-0.5" />
        )}
        <p className="text-sm text-ink-700 leading-snug pt-0.5">{toast.message}</p>
        <button onClick={clearToast} className="ml-auto text-ink-400 hover:text-ink-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
