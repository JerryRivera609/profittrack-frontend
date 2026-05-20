import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/class-names";

type StatusTone = "error" | "success";

type StatusMessageProps = {
  message?: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function StatusMessage({
  message,
  tone = "success",
}: StatusMessageProps) {
  if (!message) {
    return null;
  }

  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2 text-sm",
        toneClasses[tone],
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
