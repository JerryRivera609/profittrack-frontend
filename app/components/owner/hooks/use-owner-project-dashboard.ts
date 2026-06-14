"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { projectService } from "../../proyectos/services/project-service";
import type { Project, ProjectCatalogOption } from "../../proyectos/types/project";
import { ownerDashboardService } from "../services/owner-dashboard-service";
import type { OwnerProjectDashboard } from "../types/owner-dashboard";

export function useOwnerProjectDashboard(session: Session) {
  const canUseOwnerDashboard = session.role === "OWNER" || session.role === "ADMIN";
  const [dashboard, setDashboard] = useState<OwnerProjectDashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [notice, setNotice] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const projectOptions = useMemo<ProjectCatalogOption[]>(
    () =>
      projects.map((project) => ({
        description: `${project.codigo} - ${project.estado}`,
        label: project.nombre,
        value: project.id.toString(),
      })),
    [projects],
  );

  const selectedProject = useMemo(
    () =>
      projects.find((project) => project.id.toString() === selectedProjectId) ??
      null,
    [projects, selectedProjectId],
  );

  const loadProjects = useCallback(async () => {
    if (!canUseOwnerDashboard) {
      setIsLoadingProjects(false);
      setProjects([]);
      return;
    }

    setError("");
    setIsLoadingProjects(true);

    try {
      const response = await projectService.list(session.apiToken);
      const activeProjects = (response ?? []).filter(
        (project) => project.activo !== false,
      );

      setProjects(activeProjects);
      setSelectedProjectId((current) => {
        if (
          current &&
          activeProjects.some((project) => project.id.toString() === current)
        ) {
          return current;
        }

        return activeProjects[0]?.id.toString() ?? "";
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoadingProjects(false);
    }
  }, [canUseOwnerDashboard, session.apiToken]);

  const loadDashboard = useCallback(
    async (projectId = selectedProjectId) => {
      if (!canUseOwnerDashboard || !projectId) {
        setDashboard(null);
        return;
      }

      setError("");
      setIsLoadingDashboard(true);

      try {
        const response = await ownerDashboardService.dashboard(
          Number(projectId),
          session.apiToken,
        );
        setDashboard(response ?? null);
      } catch (loadError) {
        setDashboard(null);
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoadingDashboard(false);
      }
    },
    [canUseOwnerDashboard, selectedProjectId, session.apiToken],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProjects]);

  useEffect(() => {
    let timeoutId: number;

    if (!selectedProjectId) {
      timeoutId = window.setTimeout(() => {
        setDashboard(null);
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      void loadDashboard(selectedProjectId);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard, selectedProjectId]);

  async function createSnapshot() {
    if (!selectedProjectId) {
      return;
    }

    setError("");
    setNotice("");
    setIsSavingSnapshot(true);

    try {
      await ownerDashboardService.createSnapshot(
        Number(selectedProjectId),
        session.apiToken,
      );
      setNotice("Snapshot guardado.");
      await loadDashboard(selectedProjectId);
    } catch (snapshotError) {
      setError(getErrorMessage(snapshotError));
    } finally {
      setIsSavingSnapshot(false);
    }
  }

  return {
    canUseOwnerDashboard,
    createSnapshot,
    dashboard,
    error,
    isLoadingDashboard,
    isLoadingProjects,
    isSavingSnapshot,
    loadDashboard,
    loadProjects,
    notice,
    projectOptions,
    projects,
    selectedProject,
    selectedProjectId,
    setSelectedProjectId,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo cargar el dashboard owner.";
}
