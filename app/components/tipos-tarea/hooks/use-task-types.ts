"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { validateTaskTypeForm } from "../schema/task-type-schema";
import { taskTypeService } from "../services/task-type-service";
import type {
  TaskType,
  TaskTypeFormValues,
  TaskTypeModalState,
} from "../types/task-type";
import {
  buildCreateTaskTypePayload,
  buildUpdateTaskTypePayload,
  createTaskTypeFormValues,
  createTaskTypeScope,
} from "../utils/task-type-form";
import { getVisibleTaskTypes } from "../utils/task-type-format";

const closedModalState: TaskTypeModalState = {
  mode: "create",
  open: false,
  taskType: null,
};

export function useTaskTypes(session: Session) {
  const scope = useMemo(() => createTaskTypeScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<TaskType | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TaskTypeFormValues>(() =>
    createTaskTypeFormValues(null, session),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<TaskTypeModalState>(
    closedModalState,
  );
  const [notice, setNotice] = useState("");
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);

  const visibleTaskTypes = useMemo(
    () => getVisibleTaskTypes(taskTypes, scope),
    [taskTypes, scope],
  );

  const loadTaskTypes = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await taskTypeService.list(session.apiToken);
      setTaskTypes(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTaskTypes();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTaskTypes]);

  function openCreateModal() {
    setError("");
    setForm(createTaskTypeFormValues(null, session));
    setModalState({
      mode: "create",
      open: true,
      taskType: null,
    });
  }

  function openEditModal(taskType: TaskType) {
    setError("");
    setNotice("");
    setForm(createTaskTypeFormValues(taskType, session));
    setModalState({
      mode: "edit",
      open: true,
      taskType,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createTaskTypeFormValues(null, session));
  }

  function openDeleteModal(taskType: TaskType) {
    setDeleteTarget(taskType);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function submitTaskType() {
    const validationError = validateTaskTypeForm(
      form,
      modalState.taskType,
      scope,
    );

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.taskType) {
        await taskTypeService.update(
          modalState.taskType.id,
          buildUpdateTaskTypePayload(form),
          session.apiToken,
        );
        setNotice("Tipo de tarea actualizado.");
      } else {
        await taskTypeService.create(
          buildCreateTaskTypePayload(form, scope),
          session.apiToken,
        );
        setNotice("Tipo de tarea creado.");
      }

      closeFormModal();
      await loadTaskTypes();
      return true;
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsDeleting(true);

    try {
      await taskTypeService.remove(deleteTarget.id, session.apiToken);
      setNotice("Tipo de tarea eliminado.");
      setDeleteTarget(null);
      await loadTaskTypes();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  return {
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
    taskTypes: visibleTaskTypes,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
