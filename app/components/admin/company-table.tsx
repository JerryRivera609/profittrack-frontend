import { Building2, Pencil, Power } from "lucide-react";
import type { Empresa } from "../../types/domain";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { Panel } from "../ui/panel";

type CompanyTableProps = {
  empresas: Empresa[];
  isLoading: boolean;
  onDelete?: (empresa: Empresa) => void;
  onEdit: (empresa: Empresa) => void;
  onToggleStatus: (empresa: Empresa) => void;
  onSelect?: (empresa: Empresa) => void;
};

export function CompanyTable({
  empresas,
  isLoading,
  onDelete,
  onEdit,
  onToggleStatus,
  onSelect,
}: CompanyTableProps) {
  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Listado</p>
          <h3 className="text-lg font-semibold tracking-tight">Empresas</h3>
        </div>
        <Building2 className="size-5 text-slate-400" />
      </div>

      {!empresas.length ? (
        <EmptyState
          description={
            isLoading
              ? "Cargando empresas desde la API."
              : "Todavia no hay empresas registradas."
          }
          icon={<Building2 className="size-8" />}
          title={isLoading ? "Cargando" : "Sin empresas"}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-semibold">Empresa</th>
                <th className="py-3 pr-4 font-semibold">RUC</th>
                <th className="py-3 pr-4 font-semibold">Contacto</th>
                <th className="py-3 pr-4 font-semibold">Estado</th>
                <th className="py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-slate-900">
                      {empresa.nombre}
                    </p>
                    <p className="text-xs text-slate-500">
                      {empresa.direccion}
                    </p>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{empresa.ruc}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    <p>{empresa.correo}</p>
                    <p className="text-xs">{empresa.telefono}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                      empresa.activo 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-rose-50 text-rose-700"
                    }`}>
                      {empresa.activo ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      {onSelect && (
                        <Button
                          aria-label={`Gestionar ${empresa.nombre}`}
                          onClick={() => onSelect(empresa)}
                          variant="primary"
                        >
                          Gestionar
                        </Button>
                      )}
                      <Button
                        aria-label={`${empresa.activo ? "Desactivar" : "Activar"} ${empresa.nombre}`}
                        icon={<Power className="size-4" />}
                        onClick={() => onToggleStatus(empresa)}
                        variant={empresa.activo ? "danger" : "primary"}
                      >
                        {empresa.activo ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        aria-label={`Editar ${empresa.nombre}`}
                        icon={<Pencil className="size-4" />}
                        onClick={() => onEdit(empresa)}
                        variant="secondary"
                      >
                        Editar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
