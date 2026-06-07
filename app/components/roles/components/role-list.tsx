"use client";

import { BadgeCheck, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "../../../lib/class-names";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";
import type { Role, RoleStatusView } from "../types/role";

type RoleListProps = {
  activeCount: number;
  companyLabel: string;
  inactiveCount: number;
  isLoading: boolean;
  onDelete: (role: Role) => void;
  onEdit: (role: Role) => void;
  onReactivate: (role: Role) => void;
  onStatusViewChange: (statusView: RoleStatusView) => void;
  roles: Role[];
  statusView: RoleStatusView;
};

const statusOptions: { label: string; value: RoleStatusView }[] = [
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
];

export function RoleList({
  activeCount,
  companyLabel,
  inactiveCount,
  isLoading,
  onDelete,
  onEdit,
  onReactivate,
  onStatusViewChange,
  roles,
  statusView,
}: RoleListProps) {
  const emptyTitle =
    statusView === "active"
      ? "No hay roles registrados"
      : "No hay roles inactivos";
  const emptyDescription =
    statusView === "active"
      ? "Cuando registres el primer rol, aparecera aqui con su descripcion y acciones."
      : "Los roles desactivados apareceran aqui para poder reactivarlos.";

  return (
    <Panel>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">Catalogo</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Roles de empleados
          </h3>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
            {statusOptions.map((option) => {
              const isActive = option.value === statusView;
              const count = option.value === "active" ? activeCount : inactiveCount;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-950",
                  )}
                  key={option.value}
                  onClick={() => onStatusViewChange(option.value)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
            <p className="text-xs font-medium uppercase text-slate-400">Empresa</p>
            <p className="text-sm font-semibold text-slate-900">{companyLabel}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando los roles configurados."
            icon={<BadgeCheck className="size-6" />}
            title="Cargando roles..."
          />
        ) : roles.length === 0 ? (
          <EmptyState
            description={emptyDescription}
            icon={<BadgeCheck className="size-6" />}
            title={emptyTitle}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Nombre</th>
                  <th className="py-3 pr-4 font-medium">Descripcion</th>
                  <th className="py-3 pr-4 font-medium">Empresa</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr className="border-b border-slate-100 align-top" key={role.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{role.nombre}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{role.descripcion}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{role.nombreEmpresa}</p>
                      <p className="text-xs text-slate-400">ID {role.empresaId}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={role.activo ? "text-emerald-700" : "text-rose-700"}>
                        {role.activo ? "Activo" : "Inactivo"}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(role)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        {role.activo ? (
                          <Button
                            icon={<Trash2 className="size-4" />}
                            onClick={() => onDelete(role)}
                            variant="danger"
                          >
                            Desactivar
                          </Button>
                        ) : (
                          <Button
                            icon={<RotateCcw className="size-4" />}
                            onClick={() => onReactivate(role)}
                            variant="secondary"
                          >
                            Reactivar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Panel>
  );
}
