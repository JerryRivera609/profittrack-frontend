"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "../../../types/domain";
import { ownerDashboardService } from "../services/owner-dashboard-service";
import type { OwnerCompanyFinanceDashboard } from "../types/owner-dashboard";

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
