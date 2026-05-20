import type { ReactNode } from "react";
import { Panel } from "../ui/panel";

type Stat = {
  label: string;
  value: string;
};

type ModulePageProps = {
  actions?: ReactNode;
  children?: ReactNode;
  description: string;
  eyebrow: string;
  stats?: Stat[];
  title: string;
};

export function ModulePage({
  actions,
  children,
  description,
  eyebrow,
  stats = [],
  title,
}: ModulePageProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        {actions}
      </div>

      {stats.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {stats.map((stat) => (
            <section
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={stat.label}
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </section>
          ))}
        </div>
      )}

      {children ?? (
        <Panel>
          <p className="text-sm font-semibold text-slate-900">
            Modulo preparado
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            La ruta, layout, permisos y navegacion ya estan listos para conectar
            sus endpoints y componentes internos.
          </p>
        </Panel>
      )}
    </div>
  );
}
