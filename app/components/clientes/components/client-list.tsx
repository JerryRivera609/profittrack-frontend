"use client";

import { Building2, Pencil, Trash2 } from "lucide-react";
import type { Client } from "../types/client";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type ClientListProps = {
  clients: Client[];
  companyLabel: string;
  isLoading: boolean;
  onDelete: (client: Client) => void;
  onEdit: (client: Client) => void;
};

export function ClientList({
  clients,
  companyLabel,
  isLoading,
  onDelete,
  onEdit,
}: ClientListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Listado</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Cartera registrada
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
            description="Estamos cargando la cartera de clientes para esta vista."
            icon={<Building2 className="size-6" />}
            title="Cargando clientes..."
          />
        ) : clients.length === 0 ? (
          <EmptyState
            description="Cuando registres el primer cliente, aparecera aqui con sus datos y acciones."
            icon={<Building2 className="size-6" />}
            title="No hay clientes registrados"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Cliente</th>
                  <th className="py-3 pr-4 font-medium">Contacto</th>
                  <th className="py-3 pr-4 font-medium">Direccion</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr className="border-b border-slate-100 align-top" key={client.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{client.razonSocial}</p>
                      <p className="text-slate-500">RUC {client.ruc}</p>
                      <p className="text-xs text-slate-400">Empresa ID {client.empresaId}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{client.nombreContacto}</p>
                      <p>{client.correoContacto}</p>
                      <p>{client.telefonoContacto}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{client.direccion}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={client.activo ? "text-emerald-700" : "text-rose-700"}>
                        {client.activo ? "Activo" : "Inactivo"}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(client)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(client)}
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
