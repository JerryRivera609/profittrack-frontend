"use client";

import { BarChart3, Plus, RefreshCw } from "lucide-react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { Panel } from "../../ui/panel";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useTimeEntries } from "../hooks/use-time-entries";
import { getTimeEntryTaskName } from "../utils/time-entry-format";
import { getTimeEntryHours } from "../utils/time-entry-form";
import { TimeEntryFormModal } from "./time-entry-form-modal";
import { TimeEntryList } from "./time-entry-list";
import { TimeSummaryStrip } from "./time-summary-strip";

export function TimeEntryManagement() {
  const { session } = usePlatformAuth();
  const {
    canApproveAnyProject,
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
    form,
    isDeciding,
    isDeleting,
    isLoading,
    isLoadingStages,
    isLoadingSummary,
    isLoadingTaskTypes,
    isSaving,
    loadEntries,
    manualModalState,
    notice,
    openCreateModal,
    openDecisionModal,
    openDeleteModal,
    projectOptions,
    scope,
    setFilters,
    stageOptions,
    submitTimeEntry,
    summary,
    taskTypeOptions,
    updateForm,
  } = useTimeEntries(session);
  const showApprovalPanel = scope.canApprove || canApproveAnyProject;

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            {scope.canCreate ? (
              <Button icon={<Plus className="size-4" />} onClick={() => openCreateModal()}>
                Nueva tarea realizada
              </Button>
            ) : null}
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
          showApprovalPanel
            ? "Revisa las tareas realizadas por proyecto y aprueba o desaprueba las horas pendientes."
            : "Declara la tarea realizada y las horas dedicadas; el lider revisa la aprobacion despues."
        }
        eyebrow="Horas HH"
        title="Tareas realizadas"
      >
        <div className="space-y-5">
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <TimeSummaryStrip isLoading={isLoadingSummary} summary={summary} />

          {showApprovalPanel ? (
            <Panel>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Filtro operativo
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                    Vista por proyecto
                  </h3>
                </div>
              </div>

              <div className="mt-5 max-w-xl">
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
              </div>
            </Panel>
          ) : null}

          <TimeEntryList
            canApprove={scope.canApprove}
            currentEmployeeId={session.empleadoId}
            entries={entries}
            isLoading={isLoading}
            onApprove={(entry) => openDecisionModal(entry, "approve")}
            onDelete={openDeleteModal}
            onReject={(entry) => openDecisionModal(entry, "reject")}
          />
        </div>
      </ModulePage>

      <TimeEntryFormModal
        form={form}
        isLoadingCatalogs={isLoadingStages || isLoadingTaskTypes}
        isSaving={isSaving}
        modalState={manualModalState}
        onChange={updateForm}
        onClose={closeFormModal}
        onSubmit={submitTimeEntry}
        projectOptions={projectOptions}
        stageOptions={stageOptions}
        taskTypeOptions={taskTypeOptions}
      />

      <ConfirmModal
        confirmLabel="Eliminar registro"
        description={
          deleteTarget
            ? `Se eliminara ${getTimeEntryTaskName(deleteTarget)} mientras siga sin aprobacion.`
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
          decisionTarget?.action === "approve" ? "Aprobar horas" : "Desaprobar horas"
        }
        description={
          decisionTarget
            ? decisionTarget.action === "approve"
              ? `Se aprobaran las ${getTimeEntryHours(decisionTarget.entry).toFixed(2)} horas de ${getTimeEntryTaskName(decisionTarget.entry)}.`
              : `Se desaprobara ${getTimeEntryTaskName(decisionTarget.entry)} para que no cuente en costo ni horas oficiales.`
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
              : `Desaprobar registro #${decisionTarget.entry.id}`
            : "Confirmar decision"
        }
      />
    </>
  );
}
