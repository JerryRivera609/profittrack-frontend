"use client";

import { ListChecks, Plus, RefreshCw, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { Panel } from "../../ui/panel";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useStages } from "../hooks/use-stages";
import {
  formatDecimalValue,
  getStageStats,
  isStageHoursBalanced,
  sumStageHours,
  updateStageFormValue,
} from "../utils/stage-form";
import { StageFormModal } from "./stage-form-modal";
import { StageList } from "./stage-list";

export function StageManagement() {
  const { session } = usePlatformAuth();
  const {
    canManageStages,
    closeDeleteModal,
    closeFormModal,
    closeReactivateModal,
    confirmDelete,
    confirmReactivate,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isLoadingCatalogs,
    isLoadingInactive,
    isSaving,
    isShowingInactive,
    loadStages,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    openReactivateModal,
    projectOptions,
    reactivateTarget,
    selectedProject,
    selectedProjectId,
    setForm,
    setSelectedProjectId,
    stages,
    submitStage,
    toggleInactiveStages,
    visibleStages,
  } = useStages(session);

  const stats = useMemo(
    () => getStageStats(stages, selectedProject),
    [selectedProject, stages],
  );
  const stageHours = useMemo(() => sumStageHours(stages), [stages]);
  const hoursBalanced = isStageHoursBalanced(stages, selectedProject);

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            {canManageStages ? (
              <Button
                disabled={!selectedProjectId || isShowingInactive}
                icon={<Plus className="size-4" />}
                onClick={openCreateModal}
              >
                Nueva etapa
              </Button>
            ) : null}
            <Button
              disabled={isLoading || !selectedProjectId}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadStages()}
              variant="secondary"
            >
              Actualizar
            </Button>
            {canManageStages ? (
              <Button
                disabled={!selectedProjectId || isLoadingInactive}
                icon={<RotateCcw className="size-4" />}
                onClick={toggleInactiveStages}
                variant="secondary"
              >
                {isShowingInactive ? "Ver activas" : "Ver inactivas"}
              </Button>
            ) : null}
          </div>
        }
        description="Selecciona un proyecto para gestionar sus etapas, fechas, horas planificadas, horas reales y estado."
        eyebrow="Planificacion"
        stats={stats}
        title="Etapas"
      >
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
            <Panel>
              <SmartSelectField
                disabled={isLoadingCatalogs || projectOptions.length === 0}
                helperText="El listado, altas y ediciones trabajan sobre el proyecto seleccionado."
                icon={<ListChecks className="size-4" />}
                label="Proyecto activo"
                onChange={setSelectedProjectId}
                options={projectOptions}
                placeholder={
                  isLoadingCatalogs ? "Cargando proyectos..." : "Selecciona un proyecto"
                }
                required
                value={selectedProjectId}
              />
            </Panel>

            <Panel>
              <p className="text-sm font-medium text-slate-500">Resumen del proyecto</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">
                {selectedProject?.nombre ?? "Sin proyecto seleccionado"}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <p>Proyecto</p>
                <p className="text-right font-semibold">
                  {formatDecimalValue(selectedProject?.horasPlanificadas ?? 0)} h
                </p>
                <p>Etapas</p>
                <p className="text-right font-semibold">
                  {formatDecimalValue(stageHours)} h
                </p>
              </div>
            </Panel>
          </div>

          {!hoursBalanced ? (
            <StatusMessage
              message={`Las horas planificadas del proyecto (${formatDecimalValue(selectedProject?.horasPlanificadas ?? 0)} h) no coinciden con la suma de etapas (${formatDecimalValue(stageHours)} h). Ajusta las etapas para evitar rechazos del backend.`}
              tone="warning"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <StageList
            canManageStages={canManageStages}
            isInactiveView={isShowingInactive}
            isLoading={isShowingInactive ? isLoadingInactive : isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            onReactivate={openReactivateModal}
            stages={visibleStages}
          />
        </div>
      </ModulePage>

      {canManageStages ? (
        <StageFormModal
          form={form}
          isSaving={isSaving}
          modalState={modalState}
          onChange={(key, value) =>
            setForm((current) => updateStageFormValue(current, key, value))
          }
          onClose={closeFormModal}
          onSubmit={submitStage}
          projectName={selectedProject?.nombre}
        />
      ) : null}

      {canManageStages ? (
        <ConfirmModal
          confirmLabel="Eliminar etapa"
          description={
            deleteTarget
              ? `Se desactivara la etapa ${deleteTarget.nombre}.`
              : ""
          }
          isLoading={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={() => void confirmDelete()}
          open={Boolean(deleteTarget)}
          title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar etapa"}
        />
      ) : null}

      {canManageStages ? (
        <ConfirmModal
          confirmLabel="Reactivar etapa"
          description={
            reactivateTarget
              ? `Se reactivara la etapa ${reactivateTarget.nombre}.`
              : ""
          }
          isLoading={isSaving}
          onClose={closeReactivateModal}
          onConfirm={() => void confirmReactivate()}
          open={Boolean(reactivateTarget)}
          title={
            reactivateTarget
              ? `Reactivar ${reactivateTarget.nombre}`
              : "Reactivar etapa"
          }
        />
      ) : null}
    </>
  );
}
