"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { stageService } from "../../etapas/services/stage-service";
import { projectService } from "../../proyectos/services/project-service";
import type { Project } from "../../proyectos/types/project";
import { canApproveProjectHours } from "../../proyectos/utils/project-permissions";
import { taskTypeService } from "../../tipos-tarea/services/task-type-service";
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
  const baseScope = useMemo(() => createTimeEntryScope(session), [session]);
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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStages, setIsLoadingStages] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTaskTypes, setIsLoadingTaskTypes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [manualModalState, setManualModalState] =
    useState<TimeEntryModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projectOptions, setProjectOptions] = useState<TimeEntryCatalogOption[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stageOptions, setStageOptions] = useState<TimeEntryCatalogOption[]>([]);
  const [summary, setSummary] = useState<TimeEntrySummary | null>(null);
  const [taskTypeOptions, setTaskTypeOptions] = useState<TimeEntryCatalogOption[]>([]);

  const selectedFilterProject = useMemo(
    () =>
      projects.find((project) => project.id.toString() === filters.proyectoId) ??
      null,
    [filters.proyectoId, projects],
  );
  const scope = useMemo(
    () => ({
      ...baseScope,
      canApprove: canApproveProjectHours(session, selectedFilterProject),
    }),
    [baseScope, selectedFilterProject, session],
  );
  const canApproveAnyProject = useMemo(
    () => projects.some((project) => canApproveProjectHours(session, project)),
    [projects, session],
  );

  const loadProjectOptions = useCallback(async () => {
    try {
      const response =
        session.role === "EMPLEADO" || session.role === "LIDER"
          ? await projectService.listMine(session.apiToken)
          : await projectService.list(session.apiToken);

      const visibleProjects = (response ?? []).filter((project) =>
        baseScope.isAdmin || !baseScope.sessionEmpresaId
          ? true
          : project.empresaId === baseScope.sessionEmpresaId,
      );

      const nextOptions = visibleProjects.map((project) => ({
        description: `${project.clienteNombre} - ${project.codigo}`,
        label: project.nombre,
        value: project.id.toString(),
      }));
      const defaultProjectId =
        visibleProjects
          .find((project) => canApproveProjectHours(session, project))
          ?.id.toString() ??
        nextOptions[0]?.value ??
        "";

      setProjects(visibleProjects);
      setProjectOptions(nextOptions);
      setFilters((current) => ({
        ...current,
        proyectoId: current.proyectoId || defaultProjectId,
      }));
      setForm((current) => ({
        ...current,
        proyectoId: current.proyectoId || defaultProjectId,
      }));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }, [baseScope, session]);

  const loadTaskTypes = useCallback(async () => {
    setIsLoadingTaskTypes(true);

    try {
      const response = await taskTypeService.list(session.apiToken);
      const scopedTaskTypes = (response ?? []).filter((taskType) =>
        baseScope.isAdmin || !baseScope.sessionEmpresaId
          ? taskType.activo
          : taskType.activo && taskType.empresaId === baseScope.sessionEmpresaId,
      );

      setTaskTypeOptions(
        scopedTaskTypes.map((taskType) => ({
          description: taskType.descripcion,
          label: taskType.nombre,
          value: taskType.id.toString(),
        })),
      );
    } catch {
      setTaskTypeOptions([]);
    } finally {
      setIsLoadingTaskTypes(false);
    }
  }, [baseScope, session.apiToken]);

  const loadStagesForProject = useCallback(
    async (projectId: string) => {
      if (!projectId) {
        setStageOptions([]);
        setForm((current) => ({ ...current, etapaProyectoId: "" }));
        return;
      }

      setIsLoadingStages(true);

      try {
        const response = await stageService.listByProject(
          Number.parseInt(projectId, 10),
          session.apiToken,
        );
        const nextOptions = (response ?? [])
          .filter((stage) => stage.activo)
          .map((stage) => ({
            description: `${stage.horasPlanificadas.toFixed(2)} h planificadas`,
            label: stage.nombre,
            value: stage.id.toString(),
          }));

        setStageOptions(nextOptions);
        setForm((current) => ({
          ...current,
          etapaProyectoId: nextOptions.some(
            (option) => option.value === current.etapaProyectoId,
          )
            ? current.etapaProyectoId
            : "",
        }));
      } catch {
        setStageOptions([]);
      } finally {
        setIsLoadingStages(false);
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
        : canApproveAnyProject
          ? []
          : await timeEntryService.listMine(session.apiToken);

      setEntries(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [
    canApproveAnyProject,
    filters.proyectoId,
    scope.canApprove,
    session.apiToken,
  ]);

  const loadSummary = useCallback(async () => {
    setIsLoadingSummary(true);

    try {
      if (scope.canApprove) {
        const response = await timeEntryService.summary(
          {
            proyectoId: filters.proyectoId
              ? Number.parseInt(filters.proyectoId, 10)
              : undefined,
          },
          session.apiToken,
        );

        setSummary(response);
        return;
      }

      if (canApproveAnyProject) {
        setSummary(buildSummaryFromEntries([]));
        return;
      }

      setSummary(buildSummaryFromEntries(entries));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingSummary(false);
    }
  }, [
    canApproveAnyProject,
    entries,
    filters.proyectoId,
    scope.canApprove,
    session.apiToken,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjectOptions();
      void loadTaskTypes();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjectOptions, loadTaskTypes]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadStagesForProject(form.proyectoId);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [form.proyectoId, loadStagesForProject]);

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

  function openCreateModal(projectId = filters.proyectoId) {
    setError("");
    setNotice("");
    setForm(createTimeEntryFormValues(projectId));
    setManualModalState({ open: true });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setManualModalState(closedModalState);
    setForm(createTimeEntryFormValues(filters.proyectoId));
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
      setNotice("Tarea realizada registrada y enviada a revision.");
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
        setNotice("Horas desaprobadas.");
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
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
