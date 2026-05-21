"use client";

import { BarChart3, Info, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
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
import { PendingTaskBoard } from "./pending-task-board";
import { InfoModal } from "./info-modal";
import { TimeSummaryStrip } from "./time-summary-strip";
import { WorkSessionModal } from "./work-session-modal";

export function TimeEntryManagement() {
  const { session } = usePlatformAuth();
  const [infoOpen, setInfoOpen] = useState(false);
  const {
    closeDecisionModal,
    closeDeleteModal,
    closeFormModal,
    closeWorkSession,
    confirmDecision,
    confirmDelete,
    decisionTarget,
    deleteTarget,
    entries,
    error,
    finalizeWorkSession,
    filters,
    form,
    isDeciding,
    isDeleting,
    isFinishingSession,
    isLoading,
    isLoadingPendingTasks,
    isLoadingSummary,
    isLoadingTasks,
    isSaving,
    loadEntries,
    manualModalState,
    notice,
    openCreateModal,
    openDecisionModal,
    openDeleteModal,
    openManualEntryForTask,
    openWorkSessionForTask,
    pauseWorkSession,
    pendingTasks,
    projectOptions,
    resumeWorkSession,
    scope,
    setFilters,
    submitTimeEntry,
    summary,
    taskOptions,
    updateForm,
    updateWorkSessionDescription,
    workSession,
  } = useTimeEntries(session);

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={() => openCreateModal()}>
              Registro manual
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
            ? "Toma tiempo desde tus tareas pendientes, controla tu sesión en vivo y registra horas por tarea con una experiencia más operativa."
            : "Supervisa registros por proyecto, revisa el historial del equipo y aprueba las horas desde una vista compacta."
        }
        eyebrow="Horas HH"
        title="Control de horas hombre"
      >
        <div className="space-y-5">
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <TimeSummaryStrip isLoading={isLoadingSummary} summary={summary} />
            </div>
            {scope.isDeveloper ? (
              <Button
                icon={<Info className="size-4" />}
                onClick={() => setInfoOpen(true)}
                variant="secondary"
              >
                Flujo recomendado
              </Button>
            ) : null}
          </div>

          {scope.isDeveloper ? (
            <div className="space-y-5">
              <PendingTaskBoard
                isLoading={isLoadingPendingTasks}
                onManualEntry={openManualEntryForTask}
                onStartTask={openWorkSessionForTask}
                tasks={pendingTasks}
              />
              <TimeEntryList
                canApprove={false}
                entries={entries}
                isLoading={isLoading}
                onApprove={() => undefined}
                onDelete={openDeleteModal}
                onReject={() => undefined}
              />
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-5">
                <Panel>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Filtro operativo</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                        Vista por proyecto
                      </h3>
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
                  <p className="text-sm font-medium text-slate-500">Vista corporativa</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Aprobación compacta
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    El panel superior resume registradas, aprobadas, pendientes y rechazadas
                    sin ocupar demasiado espacio. Aquí el foco queda en revisar la tabla y
                    actuar rápido.
                  </p>
                </Panel>
              </section>
            </div>
          )}
        </div>
      </ModulePage>

      <TimeEntryFormModal
        form={form}
        isLoadingTasks={isLoadingTasks}
        isSaving={isSaving}
        modalState={manualModalState}
        onChange={updateForm}
        onClose={closeFormModal}
        onFinishNow={() => undefined}
        onStartNow={() => undefined}
        onSubmit={submitTimeEntry}
        projectOptions={projectOptions}
        showQuickCapture={false}
        taskOptions={taskOptions}
      />

      <WorkSessionModal
        isSaving={isFinishingSession}
        onClose={closeWorkSession}
        onDescriptionChange={updateWorkSessionDescription}
        onFinalize={() => void finalizeWorkSession()}
        onPause={pauseWorkSession}
        onResume={resumeWorkSession}
        session={workSession}
      />

      <InfoModal
        description={[
          "1. Toma una tarea pendiente desde el tablero.",
          "2. Inicia la sesión y deja correr el contador en tiempo real.",
          "3. Pausa cuando necesites detenerte y continúa luego.",
          "4. Finaliza para registrar las horas con comentario y descanso acumulado.",
        ]}
        onClose={() => setInfoOpen(false)}
        open={infoOpen}
        title="Flujo recomendado"
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
