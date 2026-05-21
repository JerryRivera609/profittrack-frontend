"use client";

import { CheckCircle2, Clock3, LoaderCircle, XCircle } from "lucide-react";
import type { TimeEntrySummary } from "../types/time-entry";
import { formatHours } from "../utils/time-entry-form";

export function TimeSummaryStrip({
  isLoading,
  summary,
}: {
  isLoading: boolean;
  summary: TimeEntrySummary | null;
}) {
  const items = [
    {
      icon: <Clock3 className="size-4" />,
      label: "Registradas",
      tone: "text-slate-700",
      value: summary ? formatHours(summary.totalHorasRegistradas) : "0.00 h",
    },
    {
      icon: <CheckCircle2 className="size-4" />,
      label: "Aprobadas",
      tone: "text-emerald-700",
      value: summary ? formatHours(summary.totalHorasAprobadas) : "0.00 h",
    },
    {
      icon: <LoaderCircle className="size-4" />,
      label: "Pendientes",
      tone: "text-amber-700",
      value: summary ? formatHours(summary.totalHorasPendientes) : "0.00 h",
    },
    {
      icon: <XCircle className="size-4" />,
      label: "Rechazadas",
      tone: "text-rose-700",
      value: summary ? formatHours(summary.totalHorasRechazadas) : "0.00 h",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          key={item.label}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {item.label}
              </p>
              <p className={`mt-1 text-lg font-semibold ${item.tone}`}>
                {isLoading ? "..." : item.value}
              </p>
            </div>
            <div className={`rounded-xl bg-slate-50 p-2 ${item.tone}`}>{item.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
