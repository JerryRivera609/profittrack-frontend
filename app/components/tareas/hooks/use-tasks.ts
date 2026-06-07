"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { stageService } from "../../etapas/services/stage-service";
import { projectEmployeeService } from "../../proyectos/services/project-employee-service";
import { projectService } from "../../proyectos/services/project-service";
import type { Project } from "../../proyectos/types/project";
import { canManageProjectTasks } from "../../proyectos/utils/project-permissions";
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
  buildCreateTaskPayload,
  buildTaskLifecyclePayload,
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
  const [isLoadingProjectStages, setIsLoadingProjectStages] = useState(false);
  const [isLoadingProjectTeam, setIsLoadingProjectTeam] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    action: TaskLifecycleAction;
    task: Task;
  } | null>(null);
  const [modalState, setModalState] = useState<TaskModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectOptions, setProjectOptions] = useState<TaskCatalogOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [stageOptions, setStageOptions] = useState<TaskCatalogOption[]>([]);
  const [taskTypeOptions, setTaskTypeOptions] = useState<TaskCatalogOption[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id.toString() === selectedProjectId) ??
      null,
    [projects, selectedProjectId],
  );
  const canManageTasks = useMemo(
    () => canManageProjectTasks(session, selectedProject),
    [selectedProject, session],
  );

  const loadCatalogs = useCallback(async () => {
    setIsLoadingCatalogs(true);

    try {
      const projectsResponse =
        session.role === "EMPLEADO" || session.role === "LIDER"
          ? await projectService.listMine(session.apiToken)
          : await projectService.list(session.apiToken);

      const scopedProjects = (projectsResponse ?? []).filter((project) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : project.empresaId === scope.sessionEmpresaId,
      );
      const canManageAnyProject = scopedProjects.some((project) =>
        canManageProjectTasks(session, project),
      );
      const taskTypesResponse = canManageAnyProject
        ? await taskTypeService.list(session.apiToken)
        : [];
      const scopedTaskTypes = (taskTypesResponse ?? []).filter((taskType) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : taskType.empresaId === scope.sessionEmpresaId,
      );
      const nextProjectOptions = scopedProjects.map((project) => ({
        description: `${project.clienteNombre} - ${project.codigo}`,
        label: project.nombre,
        value: project.id.toString(),
      }));

      setProjects(scopedProjects);
      setProjectOptions(nextProjectOptions);
      setEmployeeOptions([]);
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
  }, [scope, session]);

  const loadProjectTeam = useCallback(async () => {
    if (!selectedProjectId || !canManageTasks) {
      setEmployeeOptions([]);
      return;
    }

    setIsLoadingProjectTeam(true);

    try {
      const response = await projectEmployeeService.listByProject(
        Number.parseInt(selectedProjectId, 10),
        session.apiToken,
      );
      setEmployeeOptions(
        (response ?? [])
          .filter((assignment) => assignment.activo)
          .map((assignment) => ({
            description: `${assignment.rolAsignado} - asignado al proyecto`,
            label: assignment.empleadoNombre,
            value: assignment.empleadoId.toString(),
          })),
      );
    } catch (teamError) {
      setError(getErrorMessage(teamError));
    } finally {
      setIsLoadingProjectTeam(false);
    }
  }, [canManageTasks, selectedProjectId, session.apiToken]);

  const loadProjectStages = useCallback(async () => {
    if (!selectedProjectId || !canManageTasks) {
      setStageOptions([]);
      return;
    }

    setIsLoadingProjectStages(true);

    try {
      const response = await stageService.listByProject(
        Number.parseInt(selectedProjectId, 10),
        session.apiToken,
      );
      setStageOptions(
        (response ?? [])
          .filter((stage) => stage.activo)
          .map((stage) => ({
            description: `Orden ${stage.orden} - ${stage.horasPlanificadas} h`,
            label: stage.nombre,
            value: stage.id.toString(),
          })),
      );
    } catch (stageError) {
      setError(getErrorMessage(stageError));
    } finally {
      setIsLoadingProjectStages(false);
    }
  }, [canManageTasks, selectedProjectId, session.apiToken]);

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
      const nextTasks =
        !canManageTasks &&
        session.role === "EMPLEADO" &&
        typeof session.empleadoId === "number"
          ? (response ?? []).filter((task) => task.empleadoAsignadoId === session.empleadoId)
          : response ?? [];

      setTasks(nextTasks);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [
    canManageTasks,
    selectedProjectId,
    session.apiToken,
    session.empleadoId,
    session.role,
  ]);

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjectTeam();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjectTeam]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjectStages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjectStages]);

  function updateSelectedProjectId(projectId: string) {
    setSelectedProjectId(projectId);
    setEmployeeOptions([]);
    setStageOptions([]);
    setError("");
    setNotice("");
  }

  function openCreateModal() {
    if (!canManageTasks) {
      return;
    }

    setError("");
    setForm(createTaskFormValues(null, selectedProjectId));
    setModalState({
      mode: "create",
      open: true,
      task: null,
    });
  }

  function openEditModal(task: Task) {
    if (!canManageTasks) {
      return;
    }

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
    if (!canManageTasks) {
      return;
    }

    setDeleteTarget(task);
    setError("");
    setNotice("");
  }

  function openLifecycleModal(task: Task, action: TaskLifecycleAction) {
    if (!canManageTasks) {
      return;
    }

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
    if (!canManageTasks) {
      setError("No tienes permisos para gestionar tareas en este proyecto.");
      setNotice("");
      return false;
    }

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
    scope,
    selectedProject,
    selectedProjectId,
    setForm,
    setSelectedProjectId: updateSelectedProjectId,
    stageOptions,
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
