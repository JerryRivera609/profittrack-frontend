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
  formatTimeEntryDateTime,
  formatTimeEntryStatus,
  formatTimeEntryStatusTone,
  getTimeEntryDecisionDate,
  getTimeEntryTaskName,
  isTimeEntryApproved,
  isTimeEntryPending,
} from "../utils/time-entry-format";
import { getTimeEntryHours } from "../utils/time-entry-form";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type TimeEntryListProps = {
  canApprove: boolean;
  currentEmployeeId?: number;
  isLoading: boolean;
  onApprove: (entry: TimeEntry) => void;
  onDelete: (entry: TimeEntry) => void;
  onReject: (entry: TimeEntry) => void;
  entries: TimeEntry[];
};

export function TimeEntryList({
  canApprove,
  currentEmployeeId,
  isLoading,
  onApprove,
  onDelete,
  onReject,
  entries,
}: TimeEntryListProps) {
  return (
    <Panel>
      <div>
        <p className="text-sm font-medium text-slate-500">Revision operativa</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Tareas con horas
        </h3>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando las tareas realizadas disponibles para esta vista."
            icon={<Clock3 className="size-6" />}
            title="Cargando horas..."
          />
        ) : entries.length === 0 ? (
          <EmptyState
            description="Cuando se registren tareas realizadas con horas, apareceran aqui con su estado de revision."
            icon={<Clock3 className="size-6" />}
            title="No hay registros"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Trabajo</th>
                  <th className="py-3 pr-4 font-medium">Horas</th>
                  <th className="py-3 pr-4 font-medium">Descripcion</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isOwnEntry = entry.empleadoId === currentEmployeeId;
                  const canDelete = isOwnEntry && !isTimeEntryApproved(entry);
                  const canDecide = canApprove && isTimeEntryPending(entry);

                  return (
                    <tr className="border-b border-slate-100 align-top" key={entry.id}>
                      <td className="py-3 pr-4">
                        <p className="font-semibold text-slate-900">
                          {entry.proyectoNombre}
                        </p>
                        <p className="text-slate-600">{getTimeEntryTaskName(entry)}</p>
                        <p className="text-xs text-slate-400">
                          {entry.empleadoNombre} - creado{" "}
                          {formatTimeEntryDateTime(entry.creadoEn)}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        <p className="font-semibold text-slate-900">
                          {getTimeEntryHours(entry).toFixed(2)} h
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">
                        <p className="max-w-xl whitespace-pre-wrap leading-6">
                          {entry.descripcion?.trim() || "-"}
                        </p>
                      </td>
                      <td className="py-3 pr-4">
                        <p className={cn("font-semibold", formatTimeEntryStatusTone(entry))}>
                          {formatTimeEntryStatus(entry)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Decision: {formatTimeEntryDateTime(getTimeEntryDecisionDate(entry))}
                        </p>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {canDecide ? (
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
                                Desaprobar
                              </Button>
                            </>
                          ) : null}
                          {canDelete ? (
                            <Button
                              icon={<Trash2 className="size-4" />}
                              onClick={() => onDelete(entry)}
                              variant="danger"
                            >
                              Eliminar
                            </Button>
                          ) : null}
                          {!canDecide && !canDelete ? (
                            <span className="text-sm text-slate-400">Sin acciones</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Panel>
  );
}
