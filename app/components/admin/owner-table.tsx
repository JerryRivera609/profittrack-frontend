import { Pencil, Trash2, UserRound } from "lucide-react";
import { getDuenioNombre, getEmpresaNombre } from "../../lib/display";
import type { Duenio, Empresa } from "../../types/domain";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { Panel } from "../ui/panel";

type OwnerTableProps = {
  duenios: Duenio[];
  empresas: Empresa[];
  isLoading: boolean;
  onDelete: (duenio: Duenio) => void;
  onEdit: (duenio: Duenio) => void;
};

export function OwnerTable({
  duenios,
  empresas,
  isLoading,
  onDelete,
  onEdit,
}: OwnerTableProps) {
  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Listado</p>
          <h3 className="text-lg font-semibold tracking-tight">Owners</h3>
        </div>
        <UserRound className="size-5 text-slate-400" />
      </div>

      {!duenios.length ? (
        <EmptyState
          description={
            isLoading ? "Cargando owners desde la API." : "Todavia no hay owners."
          }
          icon={<UserRound className="size-8" />}
          title={isLoading ? "Cargando" : "Sin owners"}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4 font-semibold">Owner</th>
                <th className="py-3 pr-4 font-semibold">Empresa</th>
                <th className="py-3 pr-4 font-semibold">Correo</th>
                <th className="py-3 pr-4 font-semibold">Estado</th>
                <th className="py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {duenios.map((duenio) => (
                <tr key={duenio.id}>
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-slate-900">
                      {getDuenioNombre(duenio)}
                    </p>
                    <p className="text-xs text-slate-500">ID {duenio.id}</p>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">
                    {getEmpresaNombre(empresas, duenio.empresaId)}
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{duenio.correo}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {duenio.activo === false ? "Inactivo" : "Activo"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        aria-label={`Editar ${getDuenioNombre(duenio)}`}
                        icon={<Pencil className="size-4" />}
                        onClick={() => onEdit(duenio)}
                        variant="secondary"
                      >
                        Editar
                      </Button>
                      <Button
                        aria-label={`Eliminar ${getDuenioNombre(duenio)}`}
                        icon={<Trash2 className="size-4" />}
                        onClick={() => onDelete(duenio)}
                        variant="danger"
                      >
                        Eliminar
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
