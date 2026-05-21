"use client";

import {
  BarChart3,
  Clock3,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { Panel } from "../../ui/panel";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { TextField } from "../../ui/text-field";
import { useTimeEntries } from "../hooks/use-time-entries";
import { TimeEntryFormModal } from "./time-entry-form-modal";
import { TimeEntryList } from "./time-entry-list";
import { buildStatsFromSummary, formatHours } from "../utils/time-entry-form";
import { getTopProjectLabel } from "../utils/time-entry-format";

export function TimeEntryManagement() {
  const { session } = usePlatformAuth();
  const {
    closeDecisionModal,
    closeDeleteModal,
    closeFormModal,
    confirmDecision,
    confirmDelete,
    decisionTarget,
    deleteTarget,
    entries,
    error,
    filters,
    finishNow,
    form,
    isDeciding,
    isDeleting,
    isLoading,
    isLoadingSummary,
    isLoadingTasks,
    isSaving,
    loadEntries,
    modalState,
    notice,
    openCreateModal,
    openDecisionModal,
    openDeleteModal,
    projectOptions,
    scope,
    setFilters,
    startNow,
    submitTimeEntry,
    summary,
    taskOptions,
    updateForm,
  } = useTimeEntries(session);

  const stats = useMemo(() => buildStatsFromSummary(summary), [summary]);
  const topProject = useMemo(() => getTopProjectLabel(entries), [entries]);
  const visibleSummary = summary;

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Registrar horas
            </Button>
            <Button
              disabled={isLoading || isLoadingSummary}
              icon={
                <RefreshCw
                  className={
                    isLoading || isLoadingSummary ? "size-4 animate-spin" : "size-4"
                  }
                />
              }
              onClick={() => void loadEntries()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isDeveloper
            ? "Registra tiempo por tarea con temporizador o carga manual. Tus horas quedarán listas para aprobación."
            : "Supervisa horas por proyecto, aprueba registros del equipo y controla el avance real del trabajo."
        }
        eyebrow="Horas HH"
        stats={stats}
        title="Control de horas hombre"
      >
        <div className="space-y-5">
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-5">
              {scope.canApprove ? (
                <Panel>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Filtro operativo</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                        Vista por proyecto
                      </h3>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                      <p className="text-xs font-medium uppercase text-slate-400">Top proyecto</p>
                      <p className="text-sm font-semibold text-slate-900">{topProject}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <SmartSelectField
                      icon={<BarChart3 className="size-4" />}
                      label="Proyecto"
                      onChange={(value) =>
                        setFilters((current) => ({
                          ...current,
                          proyectoId: value,
                        }))
                      }
                      options={projectOptions}
                      placeholder="Selecciona un proyecto"
                      value={filters.proyectoId}
                    />
                    <TextField
                      icon={<Clock3 className="size-4" />}
                      label="Fecha inicio"
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          fechaInicio: event.target.value,
                        }))
                      }
                      type="date"
                      value={filters.fechaInicio}
                    />
                    <TextField
                      icon={<Clock3 className="size-4" />}
                      label="Fecha fin"
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          fechaFin: event.target.value,
                        }))
                      }
                      type="date"
                      value={filters.fechaFin}
                    />
                  </div>
                </Panel>
              ) : (
                <Panel>
                  <p className="text-sm font-medium text-slate-500">Modo de trabajo</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Temporizador por tarea
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Registra tu tiempo por proyecto y tarea. Usa la captura automática de inicio y fin
                    o corrige manualmente si trabajaste fuera del sistema.
                  </p>
                </Panel>
              )}

              <TimeEntryList
                canApprove={scope.canApprove}
                entries={entries}
                isLoading={isLoading}
                onApprove={(entry) => openDecisionModal(entry, "approve")}
                onDelete={openDeleteModal}
                onReject={(entry) => openDecisionModal(entry, "reject")}
              />
            </section>

            <section className="space-y-5">
              <Panel>
                <p className="text-sm font-medium text-slate-500">Resumen</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Estado de horas
                </h3>
                {isLoadingSummary ? (
                  <p className="mt-4 text-sm text-slate-500">Actualizando resumen...</p>
                ) : visibleSummary ? (
                  <div className="mt-4 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase text-slate-400">
                        Total registrado
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {formatHours(visibleSummary.totalHorasRegistradas)}
                      </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
                      <MiniStat
                        label="Aprobadas"
                        value={formatHours(visibleSummary.totalHorasAprobadas)}
                      />
                      <MiniStat
                        label="Pendientes"
                        value={formatHours(visibleSummary.totalHorasPendientes)}
                      />
                      <MiniStat
                        label="Rechazadas"
                        value={formatHours(visibleSummary.totalHorasRechazadas)}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Todavía no hay datos suficientes para construir el resumen.
                  </p>
                )}
              </Panel>

              <Panel>
                <p className="text-sm font-medium text-slate-500">Nota de producto</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                  Registro profesional por tarea
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Este flujo está pensado para productividad por proyecto, no para control de asistencia.
                  El usuario registra su trabajo por tarea y luego un líder puede aprobarlo o rechazarlo.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  La edición persistente del registro sigue pendiente de backend porque hoy no existe un
                  endpoint general de actualización para `registro-horas`.
                </p>
              </Panel>
            </section>
          </div>
        </div>
      </ModulePage>

      <TimeEntryFormModal
        form={form}
        isLoadingTasks={isLoadingTasks}
        isSaving={isSaving}
        modalState={modalState}
        onChange={updateForm}
        onClose={closeFormModal}
        onFinishNow={finishNow}
        onStartNow={startNow}
        onSubmit={submitTimeEntry}
        projectOptions={projectOptions}
        taskOptions={taskOptions}
      />

      <ConfirmModal
        confirmLabel="Eliminar registro"
        description={
          deleteTarget
            ? `Se eliminará el registro de ${deleteTarget.tareaNombre} del ${deleteTarget.fechaTrabajo}.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar registro #${deleteTarget.id}` : "Eliminar registro"}
      />

      <ConfirmModal
        confirmLabel={
          decisionTarget?.action === "approve" ? "Aprobar horas" : "Rechazar horas"
        }
        description={
          decisionTarget
            ? decisionTarget.action === "approve"
              ? `Se aprobarán las ${decisionTarget.entry.horasTrabajadas.toFixed(2)} horas registradas para ${decisionTarget.entry.tareaNombre}.`
              : `Se rechazará el registro de ${decisionTarget.entry.tareaNombre} para que no cuente en el flujo aprobado.`
            : ""
        }
        isLoading={isDeciding}
        onClose={closeDecisionModal}
        onConfirm={() => void confirmDecision()}
        open={Boolean(decisionTarget)}
        title={
          decisionTarget
            ? decisionTarget.action === "approve"
              ? `Aprobar registro #${decisionTarget.entry.id}`
              : `Rechazar registro #${decisionTarget.entry.id}`
            : "Confirmar decisión"
        }
      />
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
