import { Check, X } from "lucide-react";
import { statusFlow } from "../data/applications";

export default function ApplicationProgress({ status }) {
  if (status === "Rejected") {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <span className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
          <X size={13} />
        </span>
        Application not selected
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {statusFlow.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === statusFlow.length - 1;
        return (
          <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                  done ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-400"
                }`}
              >
                {done ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${done ? "text-ink-700 font-medium" : "text-ink-400"}`}>{step}</span>
            </div>
            {!isLast && <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? "bg-brand-600" : "bg-ink-100"}`} />}
          </div>
        );
      })}
    </div>
  );
}
