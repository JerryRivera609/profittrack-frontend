import { metrics } from "../../data/dashboard";

export function MetricsGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article
            className="rounded-[1.75rem] border border-white bg-white p-5 shadow-sm"
            key={metric.label}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
              </div>
              <div
                className={`flex size-12 items-center justify-center rounded-2xl ring-1 ${metric.tone}`}
              >
                <Icon className="size-6" />
              </div>
            </div>
            <p className="mt-5 text-sm font-semibold text-emerald-600">
              {metric.delta} frente al mes anterior
            </p>
          </article>
        );
      })}
    </div>
  );
}
