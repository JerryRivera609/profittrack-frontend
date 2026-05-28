import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/class-names";

type ToastTone = "error" | "success";

type ToastMessageProps = {
  message?: string;
  tone?: ToastTone;
};

const toneClasses: Record<ToastTone, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-800 shadow-rose-950/10",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-emerald-950/10",
};

export function ToastMessage({
  message,
  tone = "success",
}: ToastMessageProps) {
  if (!message) {
    return null;
  }

  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed right-4 top-4 z-[70] max-w-md">
      <div
        className={cn(
          "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl",
          toneClasses[tone],
        )}
      >
        <Icon className="mt-0.5 size-4 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
