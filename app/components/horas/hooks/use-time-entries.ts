"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import type { Project } from "../../proyectos/types/project";
import { projectService } from "../../proyectos/services/project-service";
import type { Task } from "../../tareas/types/task";
import { taskService } from "../../tareas/services/task-service";
import { validateTimeEntryForm } from "../schema/time-entry-schema";
import { timeEntryService } from "../services/time-entry-service";
import type {
  PendingTaskWorkItem,
  TimeEntry,
  TimeEntryCatalogOption,
  TimeEntryFilters,
  TimeEntryFormValues,
  TimeEntryModalState,
  TimeEntrySummary,
  WorkSessionState,
} from "../types/time-entry";
import {
  buildCreateTimeEntryPayload,
  buildSummaryFromEntries,
  buildTimeEntryFormValuesFromTask,
  createTimeEntryFilters,
  createTimeEntryFormValues,
  createTimeEntryScope,
  createWorkSession,
  formatDateTimeLocal,
  updateTimeEntryFormValue,
} from "../utils/time-entry-form";
import { getPendingTaskItems } from "../utils/time-entry-format";

const closedModalState: TimeEntryModalState = {
  open: false,
};

export function useTimeEntries(session: Session) {
  const scope = useMemo(() => createTimeEntryScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<TimeEntry | null>(null);
  const [decisionTarget, setDecisionTarget] = useState<{
    action: "approve" | "reject";
    entry: TimeEntry;
  } | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<TimeEntryFilters>(() =>
    createTimeEntryFilters(""),
  );
  const [form, setForm] = useState<TimeEntryFormValues>(() =>
    createTimeEntryFormValues(),
  );
  const [isDeciding, setIsDeciding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFinishingSession, setIsFinishingSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPendingTasks, setIsLoadingPendingTasks] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [manualModalState, setManualModalState] =
    useState<TimeEntryModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [pendingTasks, setPendingTasks] = useState<PendingTaskWorkItem[]>([]);
  const [projectOptions, setProjectOptions] = useState<TimeEntryCatalogOption[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<TimeEntrySummary | null>(null);
  const [taskOptions, setTaskOptions] = useState<TimeEntryCatalogOption[]>([]);
  const [workSession, setWorkSession] = useState<WorkSessionState | null>(null);

  const loadProjectOptions = useCallback(async () => {
    try {
      const response =
        session.role === "EMPLEADO"
          ? await projectService.listMine(session.apiToken)
          : await projectService.list(session.apiToken);

      const visibleProjects = (response ?? []).filter((project) =>
        scope.isAdmin || !scope.sessionEmpresaId
          ? true
          : project.empresaId === scope.sessionEmpresaId,
      );

      const nextOptions = visibleProjects.map((project) => ({
        description: `${project.clienteNombre} · ${project.codigo}`,
        label: project.nombre,
        value: project.id.toString(),
      }));

      setProjects(visibleProjects);
      setProjectOptions(nextOptions);
      setFilters((current) => ({
        ...current,
        proyectoId: current.proyectoId || nextOptions[0]?.value || "",
      }));
      setForm((current) => ({
        ...current,
        proyectoId: current.proyectoId || nextOptions[0]?.value || "",
      }));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }, [scope, session.apiToken, session.role]);

  const loadTasksForProject = useCallback(
    async (projectId: string) => {
      if (!projectId) {
        setTaskOptions([]);
        setForm((current) => ({ ...current, tareaId: "" }));
        return;
      }

      setIsLoadingTasks(true);

      try {
        const response = await taskService.listByProject(
          Number.parseInt(projectId, 10),
          session.apiToken,
        );

        const nextOptions = (response ?? []).map((task) => ({
          description: `${task.tipoTareaNombre} · ${task.empleadoNombre}`,
          label: task.nombre,
          value: task.id.toString(),
        }));

        setTaskOptions(nextOptions);
        setForm((current) => ({
          ...current,
          tareaId:
            current.proyectoId === projectId
              ? current.tareaId && nextOptions.some((item) => item.value === current.tareaId)
                ? current.tareaId
                : nextOptions[0]?.value || ""
              : current.tareaId,
        }));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [session.apiToken],
  );

  const loadPendingTasks = useCallback(async () => {
    if (!scope.isDeveloper) {
      setPendingTasks([]);
      return;
    }

    if (projects.length === 0) {
      setPendingTasks([]);
      return;
    }

    setIsLoadingPendingTasks(true);

    try {
      const taskResponses = await Promise.all(
        projects.map((project) =>
          taskService.listByProject(project.id, session.apiToken),
        ),
      );

      const nextTasks = projects.flatMap((project, index) => {
        const projectTasks = taskResponses[index] ?? [];

        return projectTasks
          .filter(
            (task) =>
              task.activo &&
              task.estado !== "FINALIZADO" &&
              (session.empleadoId
                ? task.empleadoAsignadoId === session.empleadoId
                : true),
          )
          .map((task) => mapPendingTask(project, task));
      });

      setPendingTasks(getPendingTaskItems(nextTasks));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingPendingTasks(false);
    }
  }, [projects, scope.isDeveloper, session.apiToken]);

  const loadEntries = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = scope.canApprove
        ? filters.proyectoId
          ? await timeEntryService.listByProject(
              Number.parseInt(filters.proyectoId, 10),
              session.apiToken,
            )
          : []
        : await timeEntryService.listMine(session.apiToken);

      const filteredEntries = (response ?? []).filter((entry) => {
        if (filters.fechaInicio && entry.fechaTrabajo < filters.fechaInicio) {
          return false;
        }

        if (filters.fechaFin && entry.fechaTrabajo > filters.fechaFin) {
          return false;
        }

        return true;
      });

      setEntries(filteredEntries);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [filters.fechaFin, filters.fechaInicio, filters.proyectoId, scope.canApprove, session.apiToken]);

  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);

    try {
      if (scope.canApprove) {
        const response = await timeEntryService.summary(
          {
            fechaFin: filters.fechaFin || undefined,
            fechaInicio: filters.fechaInicio || undefined,
            proyectoId: filters.proyectoId
              ? Number.parseInt(filters.proyectoId, 10)
              : undefined,
          },
          session.apiToken,
        );

        setSummary(response);
        return;
      }

      setSummary(buildSummaryFromEntries(entries));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingSummary(false);
    }
  }, [entries, filters.fechaFin, filters.fechaInicio, filters.proyectoId, scope.canApprove, session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjectOptions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjectOptions]);

  useEffect(() => {
    if (!form.proyectoId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadTasksForProject(form.proyectoId);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [form.proyectoId, loadTasksForProject]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEntries();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEntries]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSummary();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadSummary]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPendingTasks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPendingTasks]);

  function openCreateModal(projectId = filters.proyectoId, taskId = "") {
    setError("");
    setNotice("");
    setForm(
      taskId
        ? buildTimeEntryFormValuesFromTask(Number.parseInt(projectId, 10), Number.parseInt(taskId, 10))
        : createTimeEntryFormValues(projectId, ""),
    );
    setManualModalState({ open: true });
  }

  function openManualEntryForTask(task: PendingTaskWorkItem) {
    openCreateModal(task.proyectoId.toString(), task.id.toString());
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setManualModalState(closedModalState);
    setForm(createTimeEntryFormValues(filters.proyectoId, ""));
  }

  function openDeleteModal(entry: TimeEntry) {
    setDeleteTarget(entry);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  function openDecisionModal(entry: TimeEntry, action: "approve" | "reject") {
    setDecisionTarget({ action, entry });
    setError("");
    setNotice("");
  }

  function closeDecisionModal() {
    if (isDeciding) {
      return;
    }

    setDecisionTarget(null);
  }

  function openWorkSessionForTask(task: PendingTaskWorkItem) {
    setError("");
    setNotice("");
    setWorkSession(createWorkSession(task));
  }

  function closeWorkSession() {
    if (isFinishingSession) {
      return;
    }

    setWorkSession(null);
  }

  function pauseWorkSession() {
    setWorkSession((current) => {
      if (!current || current.status !== "running" || !current.lastResumedAt) {
        return current;
      }

      const now = new Date();

      return {
        ...current,
        accumulatedWorkMs:
          current.accumulatedWorkMs +
          (now.getTime() - new Date(current.lastResumedAt).getTime()),
        lastResumedAt: null,
        pausedAt: now.toISOString(),
        status: "paused",
      };
    });
  }

  function resumeWorkSession() {
    setWorkSession((current) => {
      if (!current || current.status !== "paused" || !current.pausedAt) {
        return current;
      }

      const now = new Date();

      return {
        ...current,
        accumulatedPauseMs:
          current.accumulatedPauseMs +
          (now.getTime() - new Date(current.pausedAt).getTime()),
        lastResumedAt: now.toISOString(),
        pausedAt: null,
        status: "running",
      };
    });
  }

  function updateWorkSessionDescription(value: string) {
    setWorkSession((current) => (current ? { ...current, descripcion: value } : current));
  }

  function updateForm<Key extends keyof TimeEntryFormValues>(
    key: Key,
    value: TimeEntryFormValues[Key],
  ) {
    setForm((current) => updateTimeEntryFormValue(current, key, value));
  }

  async function submitTimeEntry() {
    const validationError = validateTimeEntryForm(form);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      await timeEntryService.create(
        buildCreateTimeEntryPayload(form),
        session.apiToken,
      );
      setNotice("Registro de horas creado.");
      closeFormModal();
      await Promise.all([loadEntries(), loadSummary(), loadPendingTasks()]);
      return true;
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function finalizeWorkSession() {
    if (!workSession?.task) {
      return false;
    }

    setError("");
    setNotice("");
    setIsFinishingSession(true);

    try {
      const finishDate = new Date();
      const startedAtDate = new Date(workSession.startedAt);
      let accumulatedWorkMs = workSession.accumulatedWorkMs;
      let accumulatedPauseMs = workSession.accumulatedPauseMs;

      if (workSession.status === "running" && workSession.lastResumedAt) {
        accumulatedWorkMs +=
          finishDate.getTime() - new Date(workSession.lastResumedAt).getTime();
      }

      if (workSession.status === "paused" && workSession.pausedAt) {
        accumulatedPauseMs +=
          finishDate.getTime() - new Date(workSession.pausedAt).getTime();
      }

      const formValues: TimeEntryFormValues = {
        descripcion:
          workSession.descripcion.trim() ||
          `Trabajo registrado sobre ${workSession.task.nombre}.`,
        fechaTrabajo: workSession.fechaTrabajo,
        horaIngreso: formatDateTimeLocal(startedAtDate),
        horaSalida: formatDateTimeLocal(finishDate),
        horasTrabajadas: (accumulatedWorkMs / 3_600_000).toFixed(2),
        minutosDescanso: Math.max(0, Math.round(accumulatedPauseMs / 60_000)).toString(),
        proyectoId: workSession.task.proyectoId.toString(),
        tareaId: workSession.task.id.toString(),
      };

      const validationError = validateTimeEntryForm(formValues);

      if (validationError) {
        setError(validationError);
        return false;
      }

      await timeEntryService.create(
        buildCreateTimeEntryPayload(formValues),
        session.apiToken,
      );
      setNotice("Horas registradas desde la sesión activa.");
      setWorkSession(null);
      await Promise.all([loadEntries(), loadSummary(), loadPendingTasks()]);
      return true;
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      return false;
    } finally {
      setIsFinishingSession(false);
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
      await timeEntryService.remove(deleteTarget.id, session.apiToken);
      setNotice("Registro eliminado.");
      setDeleteTarget(null);
      await Promise.all([loadEntries(), loadSummary()]);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  async function confirmDecision() {
    if (!decisionTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsDeciding(true);

    try {
      if (decisionTarget.action === "approve") {
        await timeEntryService.approve(decisionTarget.entry.id, session.apiToken);
        setNotice("Horas aprobadas.");
      } else {
        await timeEntryService.reject(decisionTarget.entry.id, session.apiToken);
        setNotice("Horas rechazadas.");
      }

      setDecisionTarget(null);
      await Promise.all([loadEntries(), loadSummary()]);
    } catch (decisionError) {
      setError(getErrorMessage(decisionError));
    } finally {
      setIsDeciding(false);
    }
  }

  return {
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
  };
}

function mapPendingTask(project: Project, task: Task): PendingTaskWorkItem {
  return {
    clienteNombre: project.clienteNombre,
    descripcion: task.descripcion,
    empleadoAsignadoId: task.empleadoAsignadoId,
    estado: task.estado,
    fechaFinPlanificada: task.fechaFinPlanificada,
    fechaInicioPlanificada: task.fechaInicioPlanificada,
    horasPlanificadas: task.horasPlanificadas,
    horasReales: task.horasReales,
    id: task.id,
    nombre: task.nombre,
    proyectoCodigo: project.codigo,
    proyectoId: project.id,
    proyectoNombre: project.nombre,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
