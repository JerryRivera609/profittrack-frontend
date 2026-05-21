"use client";

export function LiveDurationTile({
  accent,
  label,
  value,
}: {
  accent?: "amber" | "slate" | "teal";
  label: string;
  value: string;
}) {
  const palette =
    accent === "teal"
      ? "border-teal-200 bg-teal-50 text-teal-900"
      : accent === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-white text-slate-900";

  return (
    <div className={`rounded-2xl border px-4 py-4 ${palette}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
