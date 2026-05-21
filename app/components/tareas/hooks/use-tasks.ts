"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { employeeService } from "../../empleados/services/employee-service";
import { projectService } from "../../proyectos/services/project-service";
import { taskTypeService } from "../../tipos-tarea/services/task-type-service";
import { validateTaskForm } from "../schema/task-schema";
import { taskService } from "../services/task-service";
import type {
  Task,
  TaskCatalogOption,
  TaskFormValues,
  TaskLifecycleAction,
  TaskModalState,
} from "../types/task";
import {
  buildTaskLifecyclePayload,
  buildCreateTaskPayload,
  buildUpdateTaskPayload,
  createTaskFormValues,
  createTaskScope,
} from "../utils/task-form";

const closedModalState: TaskModalState = {
  mode: "create",
  open: false,
  task: null,
};

export function useTasks(session: Session) {
  const scope = useMemo(() => createTaskScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<TaskCatalogOption[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState<TaskFormValues>(() =>
    createTaskFormValues(null, ""),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    action: TaskLifecycleAction;
    task: Task;
  } | null>(null);
  const [modalState, setModalState] = useState<TaskModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projectOptions, setProjectOptions] = useState<TaskCatalogOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [taskTypeOptions, setTaskTypeOptions] = useState<TaskCatalogOption[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadCatalogs = useCallback(async () => {
    setIsLoadingCatalogs(true);

    try {
      const [projectsResponse, employeesResponse, taskTypesResponse] = await Promise.all([
        projectService.list(session.apiToken),
        employeeService.list(session.apiToken),
        taskTypeService.list(session.apiToken),
      ]);

      const scopedProjects = (projectsResponse ?? []).filter((project) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : project.empresaId === scope.sessionEmpresaId,
      );

      const scopedEmployees = (employeesResponse ?? []).filter((employee) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : employee.empresaId === scope.sessionEmpresaId,
      );
      const scopedTaskTypes = (taskTypesResponse ?? []).filter((taskType) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : taskType.empresaId === scope.sessionEmpresaId,
      );

      const nextProjectOptions = scopedProjects.map((project) => ({
        description: `${project.clienteNombre} · ${project.codigo}`,
        label: project.nombre,
        value: project.id.toString(),
      }));

      setProjectOptions(nextProjectOptions);
      setEmployeeOptions(
        scopedEmployees.map((employee) => ({
          description: `${employee.nombreRol} · ${employee.correo}`,
          label: `${employee.nombres} ${employee.apellidos}`,
          value: employee.id.toString(),
        })),
      );

      setTaskTypeOptions(
        scopedTaskTypes.map((taskType) => ({
          description: `${taskType.nombreEmpresa} - ID ${taskType.empresaId}`,
          label: taskType.nombre,
          value: taskType.id.toString(),
        })),
      );

      setSelectedProjectId((current) => current || nextProjectOptions[0]?.value || "");
    } catch (catalogError) {
      setError(getErrorMessage(catalogError));
    } finally {
      setIsLoadingCatalogs(false);
    }
  }, [scope, session.apiToken]);

  const loadTasks = useCallback(async () => {
    if (!selectedProjectId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await taskService.listByProject(
        Number.parseInt(selectedProjectId, 10),
        session.apiToken,
      );
      setTasks(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId, session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCatalogs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCatalogs]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTasks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTasks]);

  function openCreateModal() {
    setError("");
    setForm(createTaskFormValues(null, selectedProjectId));
    setModalState({
      mode: "create",
      open: true,
      task: null,
    });
  }

  function openEditModal(task: Task) {
    setError("");
    setNotice("");
    setForm(createTaskFormValues(task, selectedProjectId));
    setModalState({
      mode: "edit",
      open: true,
      task,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createTaskFormValues(null, selectedProjectId));
  }

  function openDeleteModal(task: Task) {
    setDeleteTarget(task);
    setError("");
    setNotice("");
  }

  function openLifecycleModal(task: Task, action: TaskLifecycleAction) {
    setLifecycleTarget({ action, task });
    setError("");
    setNotice("");
  }

  function closeLifecycleModal() {
    if (isSaving) {
      return;
    }

    setLifecycleTarget(null);
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  async function submitTask() {
    const validationError = validateTaskForm(form, modalState.task);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.task) {
        await taskService.update(
          modalState.task.id,
          buildUpdateTaskPayload(form),
          session.apiToken,
        );
        setNotice("Tarea actualizada.");
      } else {
        await taskService.create(buildCreateTaskPayload(form), session.apiToken);
        setNotice("Tarea creada.");
      }

      closeFormModal();
      await loadTasks();
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
      await taskService.remove(deleteTarget.id, session.apiToken);
      setNotice("Tarea eliminada.");
      setDeleteTarget(null);
      await loadTasks();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  async function confirmLifecycleAction() {
    if (!lifecycleTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      await taskService.update(
        lifecycleTarget.task.id,
        buildTaskLifecyclePayload(lifecycleTarget.task, lifecycleTarget.action),
        session.apiToken,
      );
      setNotice(
        lifecycleTarget.action === "start"
          ? "Tarea iniciada."
          : "Tarea finalizada.",
      );
      setLifecycleTarget(null);
      await loadTasks();
    } catch (actionError) {
      setError(getErrorMessage(actionError));
    } finally {
      setIsSaving(false);
    }
  }

  return {
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
    scope,
    selectedProjectId,
    setForm,
    setSelectedProjectId,
    submitTask,
    taskTypeOptions,
    tasks,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
