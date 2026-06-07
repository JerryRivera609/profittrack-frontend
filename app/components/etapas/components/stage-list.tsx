"use client";

import { ListChecks, Pencil, RotateCcw, Trash2 } from "lucide-react";
import type { Stage } from "../types/stage";
import {
  formatDecimalValue,
  formatStageDate,
  formatStageStatus,
} from "../utils/stage-form";
import { Button } from "../../ui/button";
import { EmptyState } from "../../ui/empty-state";
import { Panel } from "../../ui/panel";

type StageListProps = {
  canManageStages: boolean;
  isInactiveView: boolean;
  isLoading: boolean;
  onDelete: (stage: Stage) => void;
  onEdit: (stage: Stage) => void;
  onReactivate: (stage: Stage) => void;
  stages: Stage[];
};

export function StageList({
  canManageStages,
  isInactiveView,
  isLoading,
  onDelete,
  onEdit,
  onReactivate,
  stages,
}: StageListProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {isInactiveView ? "Etapas inactivas" : "Plan de etapas"}
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Detalle por proyecto
          </h3>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <EmptyState
            description="Estamos cargando las etapas del proyecto seleccionado."
            icon={<ListChecks className="size-6" />}
            title="Cargando etapas..."
          />
        ) : stages.length === 0 ? (
          <EmptyState
            description={
              isInactiveView
                ? "No hay etapas inactivas para este proyecto."
                : "Cuando registres etapas para este proyecto, apareceran aqui con sus horas, fechas y estado."
            }
            icon={<ListChecks className="size-6" />}
            title={isInactiveView ? "Sin etapas inactivas" : "No hay etapas"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-4 font-medium">Etapa</th>
                  <th className="py-3 pr-4 font-medium">Horas</th>
                  <th className="py-3 pr-4 font-medium">Fechas</th>
                  <th className="py-3 pr-4 font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr className="border-b border-slate-100 align-top" key={stage.id}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-slate-900">
                        {stage.orden}. {stage.nombre}
                      </p>
                      <p className="text-xs text-slate-500">{stage.descripcion}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Plan: {formatDecimalValue(stage.horasPlanificadas)} h</p>
                      <p>Tareas: {formatDecimalValue(stage.horasTareasPlanificadas)} h</p>
                      <p>Real: {formatDecimalValue(stage.horasReales)} h</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p>Inicio plan: {formatStageDate(stage.fechaInicioPlanificada)}</p>
                      <p>Fin plan: {formatStageDate(stage.fechaFinPlanificada)}</p>
                      <p>Inicio real: {formatStageDate(stage.fechaInicioReal)}</p>
                      <p>Fin real: {formatStageDate(stage.fechaFinReal)}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      <p className="capitalize">{formatStageStatus(stage.estado)}</p>
                      <p className="text-xs text-slate-400">
                        {stage.activo ? "Activa" : "Inactiva"}
                      </p>
                    </td>
                    <td className="py-3 text-right">
                      {canManageStages ? (
                        <div className="flex justify-end gap-2">
                          {isInactiveView ? (
                            <Button
                              icon={<RotateCcw className="size-4" />}
                              onClick={() => onReactivate(stage)}
                              variant="secondary"
                            >
                              Reactivar
                            </Button>
                          ) : (
                            <>
                              <Button
                                icon={<Pencil className="size-4" />}
                                onClick={() => onEdit(stage)}
                                variant="secondary"
                              >
                                Editar
                              </Button>
                              <Button
                                icon={<Trash2 className="size-4" />}
                                onClick={() => onDelete(stage)}
                                variant="danger"
                              >
                                Eliminar
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">Solo lectura</p>
                      )}
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
