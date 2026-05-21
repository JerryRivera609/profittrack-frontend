"use client";

import {
  CheckCircle2,
  Clock3,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import { cn } from "../../../lib/class-names";
import type { TimeEntry } from "../types/time-entry";
import {
  formatTimeEntryDate,
  formatTimeEntryDateTime,
  formatTimeEntryStatus,
  formatTimeEntryStatusTone,
} from "../utils/time-entry-format";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type TimeEntryListProps = {
  canApprove: boolean;
  isLoading: boolean;
  onApprove: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
  onReject: (entry: TimeEntry) => void;
  entries: TimeEntry[];
};

export function TimeEntryList({
  canApprove,
  isLoading,
  onApprove,
  onDelete,
  onReject,
  entries,
}: TimeEntryListProps) {
  return (
    <Panel>
      <div>
        <p className="text-sm font-medium text-slate-500">Registro operativo</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Horas registradas
        </h3>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando los registros de horas disponibles para esta vista."
            icon={<Clock3 className="size-6" />}
            title="Cargando horas..."
          />
        ) : entries.length === 0 ? (
          <EmptyState
            description="Cuando se registren horas por tarea, aparecerán aquí con su detalle y estado."
            icon={<Clock3 className="size-6" />}
            title="No hay horas registradas"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Trabajo</th>
                  <th className="py-3 pr-4 font-medium">Tiempo</th>
                  <th className="py-3 pr-4 font-medium">Comentario</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr className="border-b border-slate-100 align-top" key={entry.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">{entry.proyectoNombre}</p>
                      <p className="text-slate-600">{entry.tareaNombre}</p>
                      <p className="text-xs text-slate-400">
                        {entry.empleadoNombre} · {formatTimeEntryDate(entry.fechaTrabajo)}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Inicio: {formatTimeEntryDateTime(entry.horaIngreso)}</p>
                      <p>Fin: {formatTimeEntryDateTime(entry.horaSalida)}</p>
                      <p>Descanso: {entry.minutosDescanso} min</p>
                      <p className="font-semibold text-slate-900">
                        Total: {entry.horasTrabajadas.toFixed(2)} h
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p className="max-w-xl whitespace-pre-wrap leading-6">
                        {entry.descripcion}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={cn("font-semibold", formatTimeEntryStatusTone(entry))}>
                        {formatTimeEntryStatus(entry)}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {canApprove && !entry.aprobado ? (
                          <>
                            <Button
                              icon={<CheckCircle2 className="size-4" />}
                              onClick={() => onApprove(entry)}
                              variant="secondary"
                            >
                              Aprobar
                            </Button>
                            <Button
                              icon={<ThumbsDown className="size-4" />}
                              onClick={() => onReject(entry)}
                              variant="secondary"
                            >
                              Rechazar
                            </Button>
                          </>
                        ) : null}
                        {!entry.aprobado ? (
                          <Button
                            icon={<Trash2 className="size-4" />}
                            onClick={() => onDelete(entry)}
                            variant="danger"
                          >
                            Eliminar
                          </Button>
                        ) : null}
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
