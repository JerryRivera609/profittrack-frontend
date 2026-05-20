"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { clientService } from "../../clientes/services/client-service";
import { employeeService } from "../../empleados/services/employee-service";
import { serviceTypeService } from "../../tipos-servicio/services/service-type-service";
import { validateProjectForm } from "../schema/project-schema";
import { projectService } from "../services/project-service";
import type {
  Project,
  ProjectCatalogOption,
  ProjectFormValues,
  ProjectLifecycleAction,
  ProjectModalState,
} from "../types/project";
import {
  buildCreateProjectPayload,
  buildProjectLifecyclePayload,
  buildUpdateProjectPayload,
  createProjectFormValues,
  createProjectScope,
} from "../utils/project-form";
import { getVisibleProjects } from "../utils/project-format";

const closedModalState: ProjectModalState = {
  mode: "create",
  open: false,
  project: null,
};

export function useProjects(session: Session) {
  const scope = useMemo(() => createProjectScope(session), [session]);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProjectFormValues>(() =>
    createProjectFormValues(null, session),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalState, setModalState] = useState<ProjectModalState>(closedModalState);
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientOptions, setClientOptions] = useState<ProjectCatalogOption[]>([]);
  const [lifecycleTarget, setLifecycleTarget] = useState<{
    action: ProjectLifecycleAction;
    project: Project;
  } | null>(null);
  const [leaderOptions, setLeaderOptions] = useState<ProjectCatalogOption[]>([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<ProjectCatalogOption[]>([]);

  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, scope),
    [projects, scope],
  );

  const loadCatalogs = useCallback(async () => {
    setIsLoadingCatalogs(true);

    try {
      const [clientsResponse, employeesResponse, serviceTypesResponse] =
        await Promise.all([
          clientService.list(session.apiToken),
          employeeService.list(session.apiToken),
          serviceTypeService.list(session.apiToken),
        ]);

      setClientOptions(
        buildScopedOptions(
          (clientsResponse ?? []).map((client) => ({
            description: `${client.nombreContacto} · ${client.correoContacto}`,
            empresaId: client.empresaId,
            label: `${client.razonSocial} · ${client.ruc}`,
            value: client.id.toString(),
          })),
          scope,
        ),
      );
      setLeaderOptions(
        buildScopedOptions(
          (employeesResponse ?? []).map((employee) => ({
            description: `${employee.correo} · ${employee.telefono}`,
            empresaId: employee.empresaId,
            label: `${employee.nombres} ${employee.apellidos} · ${employee.nombreRol}`,
            value: employee.id.toString(),
          })),
          scope,
        ),
      );
      setServiceTypeOptions(
        buildScopedOptions(
          (serviceTypesResponse ?? []).map((serviceType) => ({
            description: serviceType.descripcion,
            empresaId: serviceType.empresaId,
            label: serviceType.nombre,
            value: serviceType.id.toString(),
          })),
          scope,
        ),
      );
    } catch (catalogError) {
      setError(getErrorMessage(catalogError));
    } finally {
      setIsLoadingCatalogs(false);
    }
  }, [scope, session.apiToken]);

  const loadProjects = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await projectService.list(session.apiToken);
      setProjects(response ?? []);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjects]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCatalogs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCatalogs]);

  function openCreateModal() {
    setError("");
    setForm(createProjectFormValues(null, session));
    setModalState({
      mode: "create",
      open: true,
      project: null,
    });
  }

  function openEditModal(project: Project) {
    setError("");
    setNotice("");
    setForm(createProjectFormValues(project, session));
    setModalState({
      mode: "edit",
      open: true,
      project,
    });
  }

  function closeFormModal() {
    if (isSaving) {
      return;
    }

    setModalState(closedModalState);
    setForm(createProjectFormValues(null, session));
  }

  function openDeleteModal(project: Project) {
    setDeleteTarget(project);
    setError("");
    setNotice("");
  }

  function openLifecycleModal(project: Project, action: ProjectLifecycleAction) {
    setLifecycleTarget({ action, project });
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

  async function submitProject() {
    const validationError = validateProjectForm(form, modalState.project, scope);

    if (validationError) {
      setError(validationError);
      setNotice("");
      return false;
    }

    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      if (modalState.mode === "edit" && modalState.project) {
        await projectService.update(
          modalState.project.id,
          buildUpdateProjectPayload(form),
          session.apiToken,
        );
        setNotice("Proyecto actualizado.");
      } else {
        await projectService.create(
          buildCreateProjectPayload(form, scope),
          session.apiToken,
        );
        setNotice("Proyecto creado.");
      }

      closeFormModal();
      await loadProjects();
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
      await projectService.remove(deleteTarget.id, session.apiToken);
      setNotice("Proyecto eliminado.");
      setDeleteTarget(null);
      await loadProjects();
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
      await projectService.update(
        lifecycleTarget.project.id,
        buildProjectLifecyclePayload(
          lifecycleTarget.project,
          lifecycleTarget.action,
        ),
        session.apiToken,
      );
      setNotice(
        lifecycleTarget.action === "start"
          ? "Proyecto iniciado."
          : "Proyecto finalizado.",
      );
      setLifecycleTarget(null);
      await loadProjects();
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
    error,
    form,
    isDeleting,
    isLoadingCatalogs,
    isLoading,
    isSaving,
    clientOptions,
    lifecycleTarget,
    leaderOptions,
    loadProjects,
    modalState,
    notice,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    openLifecycleModal,
    projects: visibleProjects,
    serviceTypeOptions,
    scope,
    setForm,
    submitProject,
  };
}

function buildScopedOptions(
  options: Array<ProjectCatalogOption & { empresaId: number }>,
  scope: ReturnType<typeof createProjectScope>,
) {
  const visibleOptions =
    scope.isAdmin || !scope.sessionEmpresaId
      ? options
      : options.filter((option) => option.empresaId === scope.sessionEmpresaId);

  return visibleOptions.map(({ description, label, value }) => ({
    description,
    label,
    value,
  }));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo completar la operacion.";
}
