import { Activity, CheckCircle2, Clock3, FolderKanban } from "lucide-react";
import { ModulePage } from "../../components/platform/module-page";
import { Panel } from "../../components/ui/panel";

const activity = [
  "Proyecto ERP interno al 68%",
  "12 tareas vencen esta semana",
  "36 horas HH pendientes de aprobacion",
  "Reporte financiero mensual listo",
];

export default function DashboardPage() {
  return (
    <ModulePage
      description="Vista ejecutiva de rendimiento, carga operativa, horas hombre y salud financiera."
      eyebrow="Dashboard"
      stats={[
        { label: "Proyectos activos", value: "8" },
        { label: "Horas HH semana", value: "342" },
        { label: "Tareas abiertas", value: "57" },
      ]}
      title="Resumen empresarial"
    >
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Productividad
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                Estado semanal
              </h3>
            </div>
            <Activity className="size-5 text-teal-600" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardSignal
              icon={<FolderKanban className="size-5" />}
              label="Avance promedio"
              value="74%"
            />
            <DashboardSignal
              icon={<Clock3 className="size-5" />}
              label="HH aprobadas"
              value="289"
            />
            <DashboardSignal
              icon={<CheckCircle2 className="size-5" />}
              label="Tareas cerradas"
              value="41"
            />
          </div>
          <div className="mt-5 h-64 rounded-lg bg-[linear-gradient(135deg,#0f172a,#0d9488_52%,#f59e0b)] opacity-90" />
        </Panel>

        <Panel>
          <p className="text-sm font-medium text-slate-500">Actividad</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">
            Ultimos eventos
          </h3>
          <div className="mt-4 space-y-3">
            {activity.map((item) => (
              <div
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </ModulePage>
  );
}

function DashboardSignal({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 inline-flex rounded-lg bg-white p-2 text-slate-600">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
