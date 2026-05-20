"use client";

import { FolderKanban, Pencil, Trash2 } from "lucide-react";
import type { Project } from "../types/project";
import { formatProjectDate } from "../utils/project-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type ProjectListProps = {
  companyLabel: string;
  isLoading: boolean;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
  projects: Project[];
};

export function ProjectList({
  companyLabel,
  isLoading,
  onDelete,
  onEdit,
  projects,
}: ProjectListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Portafolio</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Proyectos registrados
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
            description="Estamos cargando los proyectos registrados para esta vista."
            icon={<FolderKanban className="size-6" />}
            title="Cargando proyectos..."
          />
        ) : projects.length === 0 ? (
          <EmptyState
            description="Cuando registres el primer proyecto, aparecera aqui con su estado y sus datos clave."
            icon={<FolderKanban className="size-6" />}
            title="No hay proyectos registrados"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Proyecto</th>
                  <th className="py-3 pr-4 font-medium">Relaciones</th>
                  <th className="py-3 pr-4 font-medium">Fechas</th>
                  <th className="py-3 pr-4 font-medium">Finanzas</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr className="border-b border-slate-100 align-top" key={project.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{project.nombre}</p>
                      <p className="text-slate-500">{project.codigo}</p>
                      <p className="text-xs text-slate-400">{project.descripcion}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Estado: {project.estado || "-"}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Cliente: {project.clienteNombre}</p>
                      <p>Servicio: {project.tipoServicioNombre}</p>
                      <p>Lider: {project.liderNombre}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Inicio plan: {formatProjectDate(project.fechaInicioPlanificada)}</p>
                      <p>Fin plan: {formatProjectDate(project.fechaFinPlanificada)}</p>
                      <p>Inicio real: {formatProjectDate(project.fechaInicioReal)}</p>
                      <p>Fin real: {formatProjectDate(project.fechaFinReal)}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Horas plan: {project.horasPlanificadas}</p>
                      <p>Presupuesto: {project.presupuestoPlanificado}</p>
                      <p>Margen plan: {project.margenPlanificado}</p>
                      <p>Venta: {project.precioVenta}</p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(project)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(project)}
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
