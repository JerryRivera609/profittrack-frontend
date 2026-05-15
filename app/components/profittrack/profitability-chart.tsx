import { weeklyProfitability } from "../../data/dashboard";

export function ProfitabilityChart() {
  return (
    <section className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Evolucion</p>
          <h2 className="text-xl font-semibold tracking-tight">
            Rentabilidad por semana
          </h2>
        </div>
        <button
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          type="button"
        >
          Mayo
        </button>
      </div>
      <div className="flex h-72 items-end gap-3 rounded-3xl bg-slate-50 p-4">
        {weeklyProfitability.map((height, index) => (
          <div
            className="flex flex-1 items-end rounded-full bg-white"
            key={`${height}-${index}`}
          >
            <div
              className="w-full rounded-full bg-[linear-gradient(180deg,#06b6d4,#10b981)]"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
