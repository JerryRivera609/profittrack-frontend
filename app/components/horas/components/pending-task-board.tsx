"use client";

import { CircleDashed, PlayCircle, TimerReset } from "lucide-react";
import type { PendingTaskWorkItem } from "../types/time-entry";
import { formatTimeEntryDate } from "../utils/time-entry-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type PendingTaskBoardProps = {
  isLoading: boolean;
  onManualEntry: (task: PendingTaskWorkItem) => void;
  onStartTask: (task: PendingTaskWorkItem) => void;
  tasks: PendingTaskWorkItem[];
};

export function PendingTaskBoard({
  isLoading,
  onManualEntry,
  onStartTask,
  tasks,
}: PendingTaskBoardProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Tareas pendientes</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Toma de tiempo por tarea
          </h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
          <p className="text-xs font-medium uppercase text-slate-400">Disponibles</p>
          <p className="text-sm font-semibold text-slate-900">{tasks.length}</p>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos reuniendo las tareas activas de tus proyectos para iniciar trabajo desde aquí."
            icon={<CircleDashed className="size-6" />}
            title="Cargando tareas..."
          />
        ) : tasks.length === 0 ? (
          <EmptyState
            description="No encontramos tareas activas pendientes. Cuando tengas trabajo por atender, aparecerá aquí."
            icon={<CircleDashed className="size-6" />}
            title="Sin tareas pendientes"
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {tasks.map((task) => (
              <article
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                key={`${task.proyectoId}-${task.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {task.proyectoNombre}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-950">
                      {task.nombre}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">{task.descripcion}</p>
                  </div>
                  <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                    {task.estado === "EN_CURSO" ? "En curso" : "Pendiente"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniData label="Cliente" value={task.clienteNombre} />
                  <MiniData label="Horas plan" value={`${task.horasPlanificadas.toFixed(2)} h`} />
                  <MiniData
                    label="Vence"
                    value={
                      task.fechaFinPlanificada
                        ? formatTimeEntryDate(task.fechaFinPlanificada)
                        : "Sin fecha"
                    }
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    icon={<PlayCircle className="size-4" />}
                    onClick={() => onStartTask(task)}
                  >
                    Iniciar tarea
                  </Button>
                  <Button
                    icon={<TimerReset className="size-4" />}
                    onClick={() => onManualEntry(task)}
                    variant="secondary"
                  >
                    Registrar manual
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

function MiniData({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
