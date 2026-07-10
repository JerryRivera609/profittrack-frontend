import { Building2, UserRound, UsersRound } from "lucide-react";
import type { Duenio, Empresa } from "../../types/domain";

type AdminSummaryProps = {
  totalEmpresas: number;
  empresasActivas: number;
  empresasInactivas: number;
  totalProyectos: number;
  proyectosEnCurso: number;
  totalEmpleados: number;
  totalDuenios: number;
};

export function AdminSummary({
  totalEmpresas,
  empresasActivas,
  empresasInactivas,
  totalProyectos,
  proyectosEnCurso,
  totalEmpleados,
  totalDuenios,
}: AdminSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <SummaryTile
        icon={<Building2 className="size-5" />}
        label="Total Empresas"
        tone="teal"
        value={totalEmpresas}
      />
      <SummaryTile
        icon={<Building2 className="size-5" />}
        label="Empresas Activas"
        tone="teal"
        value={empresasActivas}
      />
      <SummaryTile
        icon={<Building2 className="size-5" />}
        label="Empresas Inactivas"
        tone="slate"
        value={empresasInactivas}
      />
      <SummaryTile
        icon={<UserRound className="size-5" />}
        label="Total Owners"
        tone="amber"
        value={totalDuenios}
      />
      <SummaryTile
        icon={<UsersRound className="size-5" />}
        label="Proyectos Activos"
        tone="slate"
        value={totalProyectos}
      />
      <SummaryTile
        icon={<UsersRound className="size-5" />}
        label="Proyectos en Curso"
        tone="amber"
        value={proyectosEnCurso}
      />
    </div>
  );
}

function SummaryTile({
  icon,
  label,
  tone,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "amber" | "slate" | "teal";
  value: number | string;
}) {
  const tones = {
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${tones[tone]}`}>{icon}</div>
      </div>
    </section>
  );
}
