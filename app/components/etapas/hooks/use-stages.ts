"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { projectService } from "../../proyectos/services/project-service";
import { canManageProjectStages } from "../../proyectos/utils/project-permissions";
import { stageService } from "../services/stage-service";
import type {
  Stage,
  StageCatalogOption,
  StageFormValues,
  StageModalState,
  StageProject,
} from "../types/stage";
import {
  buildCreateStagePayload,
  buildUpdateStagePayload,
  createStageFormValues,
  validateStageForm,
} from "../utils/stage-form";

const closedModalState: StageModalState = {
  mode: "create",
  open: false,
  stage: null,
};

export function useStages(session: Session) {
  const [deleteTarget, setDeleteTarget] = useState<Stage | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<StageFormValues>(() =>
    createStageFormValues(null, null, []),
  );
  const [inactiveStages, setInactiveStages] = useState<Stage[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [isLoadingInactive, setIsLoadingInactive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShowingInactive, setIsShowingInactive] = useState(false);
  const [modalState, setModalState] = useState<StageModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState<StageProject[]>([]);
  const [reactivateTarget, setReactivateTarget] = useState<Stage | null>(null);
  const [selectedProjectId, setSelectedProjectIdState] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);

  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id.toString() === selectedProjectId) ??
      null,
    [projects, selectedProjectId],
  );
  const canManageStages = useMemo(
    () => canManageProjectStages(session, selectedProject),
    [selectedProject, session],
  );

  const projectOptions = useMemo<StageCatalogOption[]>(
    () =>
      projects.map((project) => ({
        description: `${project.clienteNombre} · ${project.codigo} · ${project.horasPlanificadas} h`,
        label: project.nombre,
        value: project.id.toString(),
      })),
    [projects],
  );

  const visibleStages = isShowingInactive ? inactiveStages : stages;

  const loadCatalogs = useCallback(async () => {
    setIsLoadingCatalogs(true);

    try {
      const response =
        session.role === "EMPLEADO" || session.role === "LIDER"
          ? await projectService.listMine(session.apiToken)
          : await projectService.list(session.apiToken);
      const scopedProjects = (response ?? []).filter((project) =>
        session.role === "ADMIN" || !session.empresaId
          ? true
          : project.empresaId === session.empresaId,
      );

      setProjects(scopedProjects);
      setSelectedProjectIdState(
        (current) => current || scopedProjects[0]?.id.toString() || "",
      );
    } catch (catalogError) {
      setError(getErrorMessage(catalogError));
    } finally {
      setIsLoadingCatalogs(false);
    }
  }, [session.apiToken, session.empresaId, session.role]);

  const loadStages = useCallback(async () => {
    if (!selectedProjectId) {
      setStages([]);
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const projectId = Number.parseInt(selectedProjectId, 10);
      const response = await stageService.listByProject(projectId, session.apiToken);
      setStages(sortStages(response ?? []));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId, session.apiToken]);

  const loadInactiveStages = useCallback(async () => {
    if (!selectedProjectId) {
      setInactiveStages([]);
      return;
    }

    setError("");
    setIsLoadingInactive(true);

    try {
      const projectId = Number.parseInt(selectedProjectId, 10);
      const response = await stageService.listInactiveByProject(
        projectId,
        session.apiToken,
      );
      setInactiveStages(sortStages(response ?? []));
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingInactive(false);
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
      void loadStages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadStages]);

  useEffect(() => {
    if (!isShowingInactive) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadInactiveStages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isShowingInactive, loadInactiveStages]);

  function setSelectedProjectId(projectId: string) {
    setSelectedProjectIdState(projectId);
    setError("");
    setNotice("");
    setInactiveStages([]);
    setIsShowingInactive(false);
  }

  function openCreateModal() {
    if (!selectedProject) {
      return;
    }

    setError("");
    setNotice("");
    setForm(createStageFormValues(null, selectedProject, stages));
    setModalState({
      mode: "create",
      open: true,
      stage: null,
    });
  }

  function openEditModal(stage: Stage) {
    setError("");
    setNotice("");
    setForm(createStageFormValues(stage, selectedProject, stages));
    setModalState({
      mode: "edit",
      open: true,
      stage,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createStageFormValues(null, selectedProject, stages));
  }

  function openDeleteModal(stage: Stage) {
    setDeleteTarget(stage);
    setError("");
    setNotice("");
  }

  function closeDeleteModal() {
    if (isDeleting) {
      return;
    }

    setDeleteTarget(null);
  }

  function openReactivateModal(stage: Stage) {
    setReactivateTarget(stage);
    setError("");
    setNotice("");
  }

  function closeReactivateModal() {
    if (isSaving) {
      return;
    }

    setReactivateTarget(null);
  }

  function toggleInactiveStages() {
    setIsShowingInactive((current) => !current);
  }

  async function submitStage() {
    if (!selectedProject) {
      setError("Selecciona un proyecto antes de registrar etapas.");
      setNotice("");
      return false;
    }

    const validationError = validateStageForm(form, modalState.stage);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.stage) {
        await stageService.update(
          modalState.stage.id,
          buildUpdateStagePayload(form),
          session.apiToken,
        );
        setNotice("Etapa actualizada.");
      } else {
        await stageService.create(
          selectedProject.id,
          buildCreateStagePayload(form, selectedProject.id),
          session.apiToken,
        );
        setNotice("Etapa creada.");
      }

      closeFormModal();
      await loadStages();
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
      await stageService.remove(deleteTarget.id, session.apiToken);
      setNotice("Etapa eliminada.");
      setDeleteTarget(null);
      await loadStages();
      if (isShowingInactive) {
        await loadInactiveStages();
      }
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  }

  async function confirmReactivate() {
    if (!reactivateTarget) {
      return;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      await stageService.reactivate(reactivateTarget.id, session.apiToken);
      setNotice("Etapa reactivada.");
      setReactivateTarget(null);
      await loadStages();
      await loadInactiveStages();
    } catch (reactivateError) {
      setError(getErrorMessage(reactivateError));
    } finally {
      setIsSaving(false);
    }
  }

  return {
    canManageStages,
    closeDeleteModal,
    closeFormModal,
    closeReactivateModal,
    confirmDelete,
    confirmReactivate,
    deleteTarget,
    error,
    form,
    inactiveStages,
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
    projects,
    reactivateTarget,
    selectedProject,
    selectedProjectId,
    setForm,
    setSelectedProjectId,
    stages,
    submitStage,
    toggleInactiveStages,
    visibleStages,
  };
}

function sortStages(stages: Stage[]) {
  return [...stages].sort((left, right) => left.orden - right.orden);
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "No se pudo completar la operacion.";
  }

  return extractBackendMessage(error.message);
}

function extractBackendMessage(message: string) {
  const separatorIndex = message.indexOf(": ");
  const responseBody =
    separatorIndex >= 0 ? message.slice(separatorIndex + 2) : "";

  if (!responseBody) {
    return message;
  }

  try {
    const parsedBody = JSON.parse(responseBody) as { error?: string; message?: string };

    return parsedBody.error ?? parsedBody.message ?? message;
  } catch {
    return responseBody || message;
  }
}
