"use client";

import { ClipboardCheck, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";
import type { TaskType } from "../types/task-type";

type TaskTypeListProps = {
  companyLabel: string;
  isLoading: boolean;
  onDelete: (taskType: TaskType) => void;
  onEdit: (taskType: TaskType) => void;
  taskTypes: TaskType[];
};

export function TaskTypeList({
  companyLabel,
  isLoading,
  onDelete,
  onEdit,
  taskTypes,
}: TaskTypeListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Catalogo</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Tipos de tarea
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
            description="Estamos cargando los tipos de tarea configurados."
            icon={<ClipboardCheck className="size-6" />}
            title="Cargando tipos de tarea..."
          />
        ) : taskTypes.length === 0 ? (
          <EmptyState
            description="Cuando registres el primer tipo de tarea, aparecera aqui con su descripcion y acciones."
            icon={<ClipboardCheck className="size-6" />}
            title="No hay tipos de tarea registrados"
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
                {taskTypes.map((taskType) => (
                  <tr className="border-b border-slate-100 align-top" key={taskType.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{taskType.nombre}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{taskType.descripcion}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{taskType.nombreEmpresa}</p>
                      <p className="text-xs text-slate-400">ID {taskType.empresaId}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={taskType.activo ? "text-emerald-700" : "text-rose-700"}>
                        {taskType.activo ? "Activo" : "Inactivo"}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(taskType)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(taskType)}
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
