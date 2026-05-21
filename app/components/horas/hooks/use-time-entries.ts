"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { projectService } from "../../proyectos/services/project-service";
import { taskService } from "../../tareas/services/task-service";
import { validateTimeEntryForm } from "../schema/time-entry-schema";
import { timeEntryService } from "../services/time-entry-service";
import type {
  TimeEntry,
  TimeEntryCatalogOption,
  TimeEntryFilters,
  TimeEntryFormValues,
  TimeEntryModalState,
  TimeEntrySummary,
} from "../types/time-entry";
import {
  applyFinishNow,
  applyStartNow,
  buildCreateTimeEntryPayload,
  buildSummaryFromEntries,
  createTimeEntryFilters,
  createTimeEntryFormValues,
  createTimeEntryScope,
  updateTimeEntryFormValue,
} from "../utils/time-entry-form";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<TimeEntryModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projectOptions, setProjectOptions] = useState<TimeEntryCatalogOption[]>([]);
  const [summary, setSummary] = useState<TimeEntrySummary | null>(null);
  const [taskOptions, setTaskOptions] = useState<TimeEntryCatalogOption[]>([]);

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
  }, [scope, session.apiToken]);

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

  function openCreateModal() {
    setError("");
    setNotice("");
    setForm(createTimeEntryFormValues(filters.proyectoId, ""));
    setModalState({ open: true });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
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

  function updateForm<Key extends keyof TimeEntryFormValues>(
    key: Key,
    value: TimeEntryFormValues[Key],
  ) {
    setForm((current) => updateTimeEntryFormValue(current, key, value));
  }

  function startNow() {
    setForm((current) => applyStartNow(current));
  }

  function finishNow() {
    setForm((current) => applyFinishNow(current));
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
      await Promise.all([loadEntries(), loadSummary()]);
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
    confirmDecision,
    confirmDelete,
    decisionTarget,
    deleteTarget,
    entries,
    error,
    filters,
    finishNow,
    form,
    isDeciding,
    isDeleting,
    isLoading,
    isLoadingSummary,
    isLoadingTasks,
    isSaving,
    loadEntries,
    modalState,
    notice,
    openCreateModal,
    openDecisionModal,
    openDeleteModal,
    projectOptions,
    scope,
    setFilters,
    startNow,
    submitTimeEntry,
    summary,
    taskOptions,
    updateForm,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
