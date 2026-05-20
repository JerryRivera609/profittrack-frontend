import { Building2, UserRound, UsersRound } from "lucide-react";
import type { Duenio, Empresa } from "../../types/domain";

type AdminSummaryProps = {
  duenios: Duenio[];
  empresas: Empresa[];
};

export function AdminSummary({ duenios, empresas }: AdminSummaryProps) {
  const activeCompanies = empresas.filter((empresa) => empresa.activo).length;
  const assignedCompanyIds = new Set(duenios.map((duenio) => duenio.empresaId));

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <SummaryTile
        icon={<Building2 className="size-5" />}
        label="Empresas"
        tone="teal"
        value={empresas.length}
      />
      <SummaryTile
        icon={<UserRound className="size-5" />}
        label="Owners"
        tone="amber"
        value={duenios.length}
      />
      <SummaryTile
        icon={<UsersRound className="size-5" />}
        label="Empresas activas"
        tone="slate"
        value={`${activeCompanies}/${assignedCompanyIds.size}`}
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
