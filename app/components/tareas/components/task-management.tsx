"use client";

import { ClipboardCheck, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { SmartSelectField } from "../../ui/smart-select-field";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useTasks } from "../hooks/use-tasks";
import { getTaskStats } from "../utils/task-format";
import { updateTaskFormValue } from "../utils/task-form";
import { TaskFormModal } from "./task-form-modal";
import { TaskList } from "./task-list";

export function TaskManagement() {
  const { session } = usePlatformAuth();
  const {
    canEditTask,
    closeDeleteModal,
    closeFormModal,
    confirmDelete,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isLoadingCatalogs,
    isLoadingProjectStages,
    isSaving,
    loadTasks,
    modalState,
    notice,
    openDeleteModal,
    openEditModal,
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
  const ownEditableCount = useMemo(
    () => tasks.filter((task) => canEditTask(task)).length,
    [canEditTask, tasks],
  );

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <Button
            disabled={isLoading || !selectedProjectId}
            icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
            onClick={() => void loadTasks()}
            variant="secondary"
          >
            Actualizar
          </Button>
        }
        description="Consulta tareas realizadas por proyecto y corrige las tuyas mientras sigan sin aprobacion."
        eyebrow="Productividad"
        stats={stats}
        title="Tareas"
      >
        <div className="space-y-5">
          <div className="max-w-xl">
            <SmartSelectField
              disabled={isLoadingCatalogs || projectOptions.length === 0}
              helperText="El listado trabaja sobre el proyecto seleccionado."
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
          {ownEditableCount > 0 ? (
            <StatusMessage
              message={`Tienes ${ownEditableCount} ${
                ownEditableCount === 1 ? "tarea propia editable" : "tareas propias editables"
              } en este proyecto.`}
            />
          ) : null}

          <TaskList
            canEditTask={canEditTask}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            tasks={tasks}
          />
        </div>
      </ModulePage>

      <TaskFormModal
        form={form}
        isLoadingCatalogs={isLoadingCatalogs || isLoadingProjectStages}
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

      <ConfirmModal
        confirmLabel="Eliminar tarea"
        description={
          deleteTarget
            ? `Se eliminara ${deleteTarget.nombre} mientras siga sin aprobacion.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar tarea"}
      />
    </>
  );
}
