"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { ownerDashboardService } from "../services/owner-dashboard-service";
import type { OwnerCompanyFinanceDashboard } from "../types/owner-dashboard";
import { API_BASE_URL } from "../../lib/api";

export function useOwnerCompanyFinance(session: Session) {
  const canUseOwnerDashboard = session.role === "OWNER" || session.role === "ADMIN";
  const [dashboard, setDashboard] =
    useState<OwnerCompanyFinanceDashboard | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadFinance = useCallback(async () => {
    if (!canUseOwnerDashboard) {
      setDashboard(null);
      setIsLoading(false);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await ownerDashboardService.companyFinance(session.apiToken);
      setDashboard(response ?? null);
    } catch (loadError) {
      setDashboard(null);
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [canUseOwnerDashboard, session.apiToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFinance();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadFinance]);

  useEffect(() => {
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
            console.log("WebSocket event: company finance metrics updated, reloading...");
            void loadFinance();
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
  }, [loadFinance]);

  const expenses = useMemo(() => dashboard?.egresos ?? [], [dashboard?.egresos]);
  const incomes = useMemo(() => dashboard?.ingresos ?? [], [dashboard?.ingresos]);
  const projects = useMemo(
    () => dashboard?.proyectos ?? [],
    [dashboard?.proyectos],
  );

  return {
    canUseOwnerDashboard,
    dashboard,
    error,
    expenses,
    incomes,
    isLoading,
    loadFinance,
    projects,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo cargar el estado financiero.";
}
