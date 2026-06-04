"use client";

import { ClipboardCheck, Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { useTasks } from "../hooks/use-tasks";
import { getTaskStats } from "../utils/task-format";
import { updateTaskFormValue } from "../utils/task-form";
import { TaskFormModal } from "./task-form-modal";
import { TaskList } from "./task-list";

export function TaskManagement() {
  const { session } = usePlatformAuth();
  const {
    canManageTasks,
    closeDeleteModal,
    closeFormModal,
    closeLifecycleModal,
    confirmLifecycleAction,
    confirmDelete,
    deleteTarget,
    employeeOptions,
    error,
    form,
    isDeleting,
    isLoading,
    isLoadingCatalogs,
    isLoadingProjectStages,
    isLoadingProjectTeam,
    isSaving,
    lifecycleTarget,
    loadTasks,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    openLifecycleModal,
    projectOptions,
    selectedProjectId,
    setForm,
    setSelectedProjectId,
    stageOptions,
    submitTask,
    taskTypeOptions,
    tasks,
  } = useTasks(session);

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const responsibleOptions = useMemo(() => {
    if (
      form.empleadoAsignadoId &&
      modalState.task &&
      !employeeOptions.some((option) => option.value === form.empleadoAsignadoId)
    ) {
      return [
        {
          description: "Responsable actual de la tarea",
          label: modalState.task.empleadoNombre,
          value: form.empleadoAsignadoId,
        },
        ...employeeOptions,
      ];
    }

    return employeeOptions;
  }, [employeeOptions, form.empleadoAsignadoId, modalState.task]);
  const taskStageOptions = useMemo(() => {
    if (
      form.etapaProyectoId &&
      modalState.task &&
      !stageOptions.some((option) => option.value === form.etapaProyectoId)
    ) {
      return [
        {
          description: "Etapa actual de la tarea",
          label: modalState.task.etapaProyectoNombre ?? "Etapa actual",
          value: form.etapaProyectoId,
        },
        ...stageOptions,
      ];
    }

    return stageOptions;
  }, [form.etapaProyectoId, modalState.task, stageOptions]);
  const assignedToMeCount = useMemo(() => {
    if (typeof session.empleadoId !== "number") {
      return 0;
    }

    return tasks.filter(
      (task) =>
        task.activo &&
        task.estado !== "FINALIZADO" &&
        task.empleadoAsignadoId === session.empleadoId,
    ).length;
  }, [session.empleadoId, tasks]);

  return (
    <>
      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            {canManageTasks ? (
              <Button
                disabled={!selectedProjectId}
                icon={<Plus className="size-4" />}
                onClick={openCreateModal}
              >
                Nueva tarea
              </Button>
            ) : null}
            <Button
              disabled={isLoading || !selectedProjectId}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadTasks()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          canManageTasks
            ? "Backlog, responsables, estados, estimaciones y seguimiento por proyecto."
            : "Consulta las tareas asignadas a tus proyectos y registra el avance desde Horas HH."
        }
        eyebrow="Productividad"
        stats={stats}
        title="Tareas"
      >
        <div className="space-y-5">
          <div className="max-w-xl">
            <SmartSelectField
              disabled={isLoadingCatalogs || projectOptions.length === 0}
              helperText="El listado y el CRUD trabajan sobre el proyecto seleccionado."
              icon={<ClipboardCheck className="size-4" />}
              label="Proyecto activo"
              onChange={setSelectedProjectId}
              options={projectOptions}
              placeholder={
                isLoadingCatalogs ? "Cargando proyectos..." : "Selecciona un proyecto"
              }
              required
              value={selectedProjectId}
            />
          </div>

          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />
          {assignedToMeCount > 0 ? (
            <StatusMessage
              message={`Tienes ${assignedToMeCount} ${
                assignedToMeCount === 1 ? "tarea asignada" : "tareas asignadas"
              } en este proyecto.`}
            />
          ) : null}

          <TaskList
            canManageTasks={canManageTasks}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            onLifecycleAction={openLifecycleModal}
            tasks={tasks}
          />
        </div>
      </ModulePage>

      {canManageTasks ? (
        <TaskFormModal
          employeeOptions={responsibleOptions}
          form={form}
          isLoadingCatalogs={
            isLoadingCatalogs || isLoadingProjectTeam || isLoadingProjectStages
          }
          isSaving={isSaving}
          modalState={modalState}
          onChange={(key, value) => {
            if (key === "proyectoId") {
              setSelectedProjectId(value);
            }

            setForm((current) => {
              const nextForm = updateTaskFormValue(current, key, value);

              if (key === "proyectoId" && current.proyectoId !== value) {
                return {
                  ...nextForm,
                  empleadoAsignadoId: "",
                  etapaProyectoId: "",
                };
              }

              return nextForm;
            });
          }}
          onClose={closeFormModal}
          onSubmit={submitTask}
          projectOptions={projectOptions}
          stageOptions={taskStageOptions}
          taskTypeOptions={taskTypeOptions}
        />
      ) : null}

      {canManageTasks ? (
        <ConfirmModal
          confirmLabel="Eliminar tarea"
          description={
            deleteTarget
              ? `Se eliminara ${deleteTarget.nombre} del backlog del proyecto.`
              : ""
          }
          isLoading={isDeleting}
          onClose={closeDeleteModal}
          onConfirm={() => void confirmDelete()}
          open={Boolean(deleteTarget)}
          title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar tarea"}
        />
      ) : null}

      {canManageTasks ? (
        <ConfirmModal
          confirmLabel={
            lifecycleTarget?.action === "start" ? "Iniciar tarea" : "Finalizar tarea"
          }
          description={
            lifecycleTarget
              ? lifecycleTarget.action === "start"
                ? `Se registrara el inicio real de ${lifecycleTarget.task.nombre} con la fecha de hoy.`
                : `Se registrara el cierre real de ${lifecycleTarget.task.nombre} con la fecha de hoy.`
              : ""
          }
          isLoading={isSaving}
          onClose={closeLifecycleModal}
          onConfirm={() => void confirmLifecycleAction()}
          open={Boolean(lifecycleTarget)}
          title={
            lifecycleTarget
              ? lifecycleTarget.action === "start"
                ? `Iniciar ${lifecycleTarget.task.nombre}`
                : `Finalizar ${lifecycleTarget.task.nombre}`
              : "Confirmar accion"
          }
        />
      ) : null}
    </>
  );
}
