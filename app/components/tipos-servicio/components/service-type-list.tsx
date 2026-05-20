"use client";

import { Pencil, Settings, Trash2 } from "lucide-react";
import type { ServiceType } from "../types/service-type";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type ServiceTypeListProps = {
  companyLabel: string;
  isLoading: boolean;
  onDelete: (serviceType: ServiceType) => void;
  onEdit: (serviceType: ServiceType) => void;
  serviceTypes: ServiceType[];
};

export function ServiceTypeList({
  companyLabel,
  isLoading,
  onDelete,
  onEdit,
  serviceTypes,
}: ServiceTypeListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Catalogo</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Tipos de servicio
          </h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <p className="text-xs font-medium uppercase text-slate-400">Empresa</p>
          <p className="text-sm font-semibold text-slate-900">{companyLabel}</p>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando los tipos de servicio configurados."
            icon={<Settings className="size-6" />}
            title="Cargando tipos de servicio..."
          />
        ) : serviceTypes.length === 0 ? (
          <EmptyState
            description="Cuando registres el primer tipo de servicio, aparecera aqui con su descripcion y acciones."
            icon={<Settings className="size-6" />}
            title="No hay tipos de servicio registrados"
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
                {serviceTypes.map((serviceType) => (
                  <tr className="border-b border-slate-100 align-top" key={serviceType.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{serviceType.nombre}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{serviceType.descripcion}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{serviceType.nombreEmpresa}</p>
                      <p className="text-xs text-slate-400">ID {serviceType.empresaId}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={serviceType.activo ? "text-emerald-700" : "text-rose-700"}>
                        {serviceType.activo ? "Activo" : "Inactivo"}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(serviceType)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(serviceType)}
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
      </div>
    </Panel>
  );
}
