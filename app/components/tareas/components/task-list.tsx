"use client";

import { ClipboardCheck, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../types/task";
import { formatTaskDate } from "../utils/task-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type TaskListProps = {
  isLoading: boolean;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  tasks: Task[];
};

export function TaskList({
  isLoading,
  onDelete,
  onEdit,
  tasks,
}: TaskListProps) {
  return (
    <Panel>
      <div>
        <p className="text-sm font-medium text-slate-500">Backlog</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Tareas del proyecto
        </h3>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando las tareas registradas para este proyecto."
            icon={<ClipboardCheck className="size-6" />}
            title="Cargando tareas..."
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            description="Cuando registres la primera tarea para el proyecto seleccionado, aparecera aqui."
            icon={<ClipboardCheck className="size-6" />}
            title="No hay tareas registradas"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Tarea</th>
                  <th className="py-3 pr-4 font-medium">Asignacion</th>
                  <th className="py-3 pr-4 font-medium">Fechas</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr className="border-b border-slate-100 align-top" key={task.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{task.nombre}</p>
                      <p className="text-slate-500">{task.tipoTareaNombre}</p>
                      <p className="text-xs text-slate-400">{task.descripcion}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>{task.empleadoNombre}</p>
                      <p>Horas plan: {task.horasPlanificadas}</p>
                      <p>Horas reales: {task.horasReales}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Inicio plan: {formatTaskDate(task.fechaInicioPlanificada)}</p>
                      <p>Fin plan: {formatTaskDate(task.fechaFinPlanificada)}</p>
                      <p>Inicio real: {formatTaskDate(task.fechaInicioReal)}</p>
                      <p>Fin real: {formatTaskDate(task.fechaFinReal)}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={task.activo ? "text-emerald-700" : "text-rose-700"}>
                        {task.estado || (task.activo ? "Activa" : "Inactiva")}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          icon={<Pencil className="size-4" />}
                          onClick={() => onEdit(task)}
                          variant="secondary"
                        >
                          Editar
                        </Button>
                        <Button
                          icon={<Trash2 className="size-4" />}
                          onClick={() => onDelete(task)}
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
