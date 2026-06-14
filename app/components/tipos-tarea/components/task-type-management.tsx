"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { usePlatformAuth } from "../../platform/platform-auth-context";
import { ModulePage } from "../../platform/module-page";
import { Button } from "../../ui/button";
import { ConfirmModal } from "../../ui/confirm-modal";
import { StatusMessage } from "../../ui/status-message";
import { ToastMessage } from "../../ui/toast-message";
import { useTaskTypes } from "../hooks/use-task-types";
import { getTaskTypeStats } from "../utils/task-type-format";
import { updateTaskTypeFormValue } from "../utils/task-type-form";
import { TaskTypeFormModal } from "./task-type-form-modal";
import { TaskTypeList } from "./task-type-list";

export function TaskTypeManagement() {
  const { session } = usePlatformAuth();
  const {
    closeDeleteModal,
    closeFormModal,
    confirmDelete,
    deleteTarget,
    error,
    form,
    isDeleting,
    isLoading,
    isSaving,
    loadTaskTypes,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    scope,
    setForm,
    submitTaskType,
    taskTypes,
  } = useTaskTypes(session);

  const stats = useMemo(() => getTaskTypeStats(taskTypes), [taskTypes]);

  return (
    <>
      <ToastMessage
        message={error || notice}
        tone={error ? "error" : "success"}
      />

      <ModulePage
        actions={
          <div className="flex flex-wrap gap-3">
            <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
              Nuevo tipo
            </Button>
            <Button
              disabled={isLoading}
              icon={<RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />}
              onClick={() => void loadTaskTypes()}
              variant="secondary"
            >
              Actualizar
            </Button>
          </div>
        }
        description={
          scope.isAdmin
            ? "Administra el catalogo de tipos de tarea de todas las empresas con altas, ediciones y bajas."
            : `Administra los tipos de tarea de ${session.companyName ?? "tu empresa"} con altas, ediciones y bajas.`
        }
        eyebrow="Sistema"
        stats={stats}
        title="Tipos de tarea"
      >
        <div className="space-y-5">
          {!scope.isAdmin && !scope.sessionEmpresaId ? (
            <StatusMessage
              message="Tu sesion no tiene empresaId. No se puede registrar tipos de tarea hasta corregir ese dato."
              tone="error"
            />
          ) : null}
          <StatusMessage message={notice} />
          <StatusMessage message={error} tone="error" />

          <TaskTypeList
            companyLabel={scope.isAdmin ? "Todas" : session.companyName ?? "Tu empresa"}
            isLoading={isLoading}
            onDelete={openDeleteModal}
            onEdit={openEditModal}
            taskTypes={taskTypes}
          />
        </div>
      </ModulePage>

      <TaskTypeFormModal
        form={form}
        isSaving={isSaving}
        modalState={modalState}
        onChange={(key, value) =>
          setForm((current) => updateTaskTypeFormValue(current, key, value))
        }
        onClose={closeFormModal}
        onSubmit={submitTaskType}
        scope={scope}
      />

      <ConfirmModal
        confirmLabel="Eliminar tipo"
        description={
          deleteTarget
            ? `Se eliminara ${deleteTarget.nombre} del catalogo de tipos de tarea.`
            : ""
        }
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={() => void confirmDelete()}
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Eliminar ${deleteTarget.nombre}` : "Eliminar tipo"}
      />
    </>
  );
}
