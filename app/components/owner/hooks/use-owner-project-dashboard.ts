"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { projectService } from "../../proyectos/services/project-service";
import type { Project, ProjectCatalogOption } from "../../proyectos/types/project";
import { ownerDashboardService } from "../services/owner-dashboard-service";
import type { OwnerProjectDashboard } from "../types/owner-dashboard";
import { API_BASE_URL } from "../../../lib/api";

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

  useEffect(() => {
    if (!selectedProjectId) return;

    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isMounted = true;

    function connect() {
      if (!isMounted) return;
      try {
        const wsProtocol = API_BASE_URL.startsWith("https") ? "wss" : "ws";
        const wsUrl = `${API_BASE_URL.replace(/^https?:\/\//, `${wsProtocol}://`)}/ws/metrics`;
        
        socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
          if (event.data === "project-updated" && isMounted) {
            console.log("WebSocket event: project metrics updated, reloading...");
            void loadDashboard(selectedProjectId);
          }
        };

        socket.onclose = () => {
          if (isMounted) {
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

        socket.onerror = (err) => {
          socket?.close();
        };
      } catch (err) {
        if (isMounted) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
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
